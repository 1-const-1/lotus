"use strict";

import {mongoClient } from "./mongo";
import http from "http";
import httpProxy from "http-proxy";
import {Server} from "socket.io";
import express from "express";
import { FormParser } from "./custom_packages/form-parser/form-parser";
import { createAccount } from "./methods/account/createAccount";
import { RefreshToken } from "./methods/jwt/refreshToken";
import {v4 as uuidv4} from "uuid";
import { JsonToken } from "./methods/jwt/jsonToken";
import {parse, serialize} from "cookie";
import { checkCredential } from "./methods/account/checkCredentials";
import { updateJWT } from "./methods/jwt/updateJWT";
import { checkDataToCreateRoom } from "./methods/dashboard/trades/checkDataToCreateRoom";

const webPort = 6000;
const proxyPort = 8000;

/**
 * Proxy server to interact with React application
 */
httpProxy.createProxyServer({target: `http://localhost:${webPort}`}).listen(proxyPort);

/**
 * Set server with express framework
 */
const app = express();

const server = http.createServer(app);

const ioServer = new Server(server);
//////////////////////////////////////////////
// APPLICATION ROUTES START
//////////////////////////////////////////////

app.get("/", (req, res) => {
  res.json({"message": "Home page"});
});

app.get("/call", (req, res) => {
  res.json({"message": "call endpoint"});
});

app.get("/account", (req, res) => {
  res.json({"message": "account page"});
});

/**
 * The main user interface
 */
app.get("/participant", (req, res)=> {
  const c = parse(req.headers.cookie!);
  if (!c.JWT_TOKEN) {
    res.writeHead(302, {
      "set-cookie": [serialize("JWT_TOKEN", "", {maxAge: 0})],
      "location": "http://localhost:3000/account",
    });
    res.end();
  }
  res.end();
});

app.get("/participant/form", async (req, res)=> {
  const c = parse(req.headers.cookie!);
  if (!c.JWT_TOKEN) {
    res.writeHead(302, {
      "set-cookie": [serialize("JWT_TOKEN", "", {maxAge: 0})],
      "location": "http://localhost:3000/account",
    });
    res.end();
  }

  const jwtP = JsonToken.getPayload(c.JWT_TOKEN!);
  
  const db = mongoClient.db("lotus");
  
  const uData = await db.collection("users").findOne({user_id: jwtP?.user_id});

  if (!uData?.first_sign) {
    res.writeHead(302, {
      "location": "http://localhost:3000/participant",
    });
  }

  res.end();
});

/**
 * Update a session token (JWT)
 */
app.get("/token/admin", (req, res) => {
  const result = updateJWT(req.headers.cookie!);

  if (!result.value) {
    res.writeHead(302, {
      "set-cookie": [serialize("JWT_TOKEN", "", {maxAge: 0})],
      "location": "http://localhost:3000/account",
    });
  }

  if (result.value === 2) {
    res.writeHead(200, {
      "set-cookie": [serialize("JWT_TOKEN", result.newJwt?.info().jwt!, {httpOnly: true,maxAge: 60 * 60 * 3.15})],
    });
  };
  
  res.end();
});

/**
 * Update a session token (JWT)
 */
app.get("/token", (req, res) => {
  const result = updateJWT(req.headers.cookie!);

  if (!result.value) {
    res.writeHead(302, {
      "set-cookie": [serialize("JWT_TOKEN", "", {maxAge: 0})],
      "location": "http://localhost:3000/account",
    });
  }

  if (result.value === 2) {
    res.writeHead(200, {
      "set-cookie": [serialize("JWT_TOKEN", result.newJwt?.info().jwt!, {httpOnly: true,maxAge: 60 * 60 * 3.15})],
    });
  };
  
  res.end();
});

app.post("/trade/room/create", (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
      body += chunk;
  });

  req.on("end", () => {
    /**
     * Parsed form
     */
    const f = FormParser(body);

    if (!f.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    /**
     * Checker variable for methods
     */
    let result;

    result = checkDataToCreateRoom(f.form!);
    if (!result.value) {
      res.writeHead(500, "Invalid data");
      return res.end();
    }

    /**
     * Test MongoDB Database
     */
    const db = mongoClient.db("lotus");
    db.collection("trade_rooms").insertOne(result.data!);

    return res.end();
  });
});

app.post("/account/login", (req, res)=> {
  let body = "";

  req.on("data", (chunk) => {
      body += chunk;
  });

  req.on("end", async () => {
    /**
     * Parsed form
     */
    const f = FormParser(body);

    if (!f.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    /**
     * Checker variable for methods
     */
    let result;

    /**
     * User insertion kit
     */
    let uOption : {login:string, pass:string};
    uOption = {
      login: f.form ? f.form[0].value.toString() : "", 
      pass: f.form ? f.form[1].value.toString() : "",
    }

    result = await checkCredential(uOption);

    if (!result.value) {
      res.writeHead(403, "Invalid data");
      return res.end();
    }

    /**
     * Test MongoDB Database
     */
    const db = mongoClient.db("lotus");

    /**
     * Get user data to compare the entered and stored passwords
     */
    let uData = await db.collection("users").findOne({login: uOption.login});
    if (!uData) {
      res.writeHead(403, "Invalid data");
      return res.end();
    }

    /**
     * Check if a user has an old refresh token not to create another one
     */
    const oldRT = await db.collection("refresh_token").findOne({user_id: uData?.user_id});
    
    let rToken = new RefreshToken();
    result = rToken.generate(uData?.user_id);
    if (!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    let rtInfo = rToken.info();

    result = rToken.generate(uData?.user_id);
    if (!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    /**
     * if a refresh token exists then it update it or it create another one 
     */
    if (!oldRT) {
      db.collection("refresh_token").insertOne({
        id: rtInfo.id, 
        user_id:rtInfo.user_id, 
        token: rtInfo.bhash
      });
    } else {
      db.collection("refresh_token").updateOne(
        {user_id: uData?.user_id}, 
        {$set: {token: rtInfo.bhash}});
    }

    /**
     * A new json web token
     */
    const jwt = new JsonToken();

    const jwtP = {
      user_id: uData?.user_id,
      login: uOption.login,
      refresh_token : rtInfo.token,
    }

    result = jwt.generate("sha256", jwtP, "TEST_SECRET_KEY");
    if(!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    const jwtInfo = jwt.info();
    
    res.writeHead(302, {
      "Set-Cookie" : [serialize("JWT_TOKEN", jwtInfo.jwt, {path: "/",httpOnly: true,maxAge: 60 * 60 * 3.15,})],
      "Location" : "http://localhost:3000/participant",
    });

    return res.end();
  });
});

app.post("/account/signup", (req, res)=> {
  let body = "";

  req.on("data", (chunk) => {
      body += chunk;
  });

  req.on("end", async () => {
    /**
     * Parsed form
     */
    const f = FormParser(body);

    if (!f.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    /**
     * Checker variable for methods
     */
    let result;

    /**
     * User insertion kit
     */
    let uOption : {user_id:string, login:string, pass:string};
    uOption = {
      user_id: uuidv4(),
      login: f.form ? f.form[0].value.toString() : "", 
      pass: f.form ? f.form[1].value.toString() : "",
    }

    result = await createAccount(uOption);

    if (!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    /**
     * Test MongoDB Database
     */
    const db = mongoClient.db("lotus");

    /**
     * New Refresh token
     */
    let rToken = new RefreshToken();

    result = rToken.generate(uOption.user_id);
    if (!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    let rtInfo = rToken.info();

    /**
     * Insert new Refresh token
     */
    db.collection("refresh_token").insertOne({
      id: rtInfo.id,
      user_id: rtInfo.user_id,
      token: rtInfo.bhash,
    });

    /**
     * A new json web token
     */
    const jwt = new JsonToken();

    const jwtP = {
      user_id: uOption.user_id,
      login: uOption.login,
      refresh_token : rtInfo.token,
    }

    result = jwt.generate("sha256", jwtP, "TEST_SECRET_KEY");
    if(!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    const jwtInfo = jwt.info();

    res.writeHead(302, {
      "Set-Cookie" : [serialize("JWT_TOKEN", jwtInfo.jwt, {path: "/",httpOnly: true,maxAge: 60 * 60 * 3.15,})],
      "Location" : "http://localhost:3000/participant/form",
    });

    return res.end();
  });
});


app.post("/a/signup", (req, res)=> {
  let body = "";

  req.on("data", (chunk) => {
      body += chunk;
  });

  req.on("end", async () => {
    /**
     * Parsed form
     */
    const f = FormParser(body);

    if (!f.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    /**
     * Checker variable for methods
     */
    let result;

    /**
     * User insertion kit
     */
    let uOption : {user_id:string, login:string, pass:string};
    uOption = {
      user_id: uuidv4(),
      login: f.form ? f.form[0].value.toString() : "", 
      pass: f.form ? f.form[1].value.toString() : "",
    }

    result = await createAccount(uOption);

    if (!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    /**
     * Test MongoDB Database
     */
    const db = mongoClient.db("lotus");

    /**
     * New Refresh token
     */
    let rToken = new RefreshToken();

    result = rToken.generate(uOption.user_id);
    if (!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    let rtInfo = rToken.info();

    /**
     * Insert new Refresh token
     */
    db.collection("refresh_token").insertOne({
      id: rtInfo.id,
      user_id: rtInfo.user_id,
      token: rtInfo.bhash,
    });

    /**
     * A new json web token
     */
    const jwt = new JsonToken();

    const jwtP = {
      user_id: uOption.user_id,
      login: uOption.login,
      refresh_token : rtInfo.token,
      admin: "true",
    }

    result = jwt.generate("sha256", jwtP, "TEST_SECRET_KEY");
    if(!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    const jwtInfo = jwt.info();

    res.writeHead(302, {
      "Set-Cookie" : [serialize("JWT_TOKEN", jwtInfo.jwt, {path: "/",httpOnly: true,maxAge: 60 * 60 * 3.15,})],
      "Location" : "http://localhost:3000/a/dashboard",
    });

    return res.end();
  });
});

app.post("/a/login", (req, res)=> {
  let body = "";

  req.on("data", (chunk) => {
      body += chunk;
  });

  req.on("end", async () => {
    /**
     * Parsed form
     */
    const f = FormParser(body);

    if (!f.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    /**
     * Checker variable for methods
     */
    let result;

    /**
     * User insertion kit
     */
    let uOption : {login:string, pass:string};
    uOption = {
      login: f.form ? f.form[0].value.toString() : "", 
      pass: f.form ? f.form[1].value.toString() : "",
    }

    result = await checkCredential(uOption);

    if (!result.value) {
      res.writeHead(403, "Invalid data");
      return res.end();
    }

    /**
     * Test MongoDB Database
     */
    const db = mongoClient.db("lotus");

    /**
     * Get user data to compare the entered and stored passwords
     */
    let uData = await db.collection("users").findOne({login: uOption.login});
    if (!uData) {
      res.writeHead(403, "Invalid data");
      return res.end();
    }

    /**
     * Check if a user has an old refresh token not to create another one
     */
    const oldRT = await db.collection("refresh_token").findOne({user_id: uData?.user_id});
    
    let rToken = new RefreshToken();
    result = rToken.generate(uData?.user_id);
    if (!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    let rtInfo = rToken.info();

    result = rToken.generate(uData?.user_id);
    if (!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    /**
     * if a refresh token exists then it update it or it create another one 
     */
    if (!oldRT?.user_id) {
      db.collection("refresh_token").insertOne({
        id: rtInfo.id, 
        user_id:rtInfo.user_id, 
        token: rtInfo.bhash
      });
    } else {
      db.collection("refresh_token").updateOne(
        {user_id: uData?.user_id}, 
        {$set: {token: rtInfo.bhash}});
    }

    /**
     * A new json web token
     */
    const jwt = new JsonToken();

    const jwtP = {
      user_id: uData?.user_id,
      login: uOption.login,
      refresh_token : rtInfo.token,
      admin: "true",
    }

    result = jwt.generate("sha256", jwtP, "TEST_SECRET_KEY");
    if(!result.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    const jwtInfo = jwt.info();
    
    res.writeHead(302, {
      "Set-Cookie" : [serialize("JWT_TOKEN", jwtInfo.jwt, {path: "/",httpOnly: true,maxAge: 60 * 60 * 3.15,})],
      "Location" : "http://localhost:3000/a/dashboard",
    });

    return res.end();
  });
});

app.post("/participant/form", (req, res)=> {
  let body = "";

  req.on("data", (chunk)=>{
    body += chunk;
  });

  req.on("end", async ()=> {
    /**
     * Parsed form
     */
    const f = FormParser(body);

    if (!f.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    const c = parse(req.headers.cookie!);
    if (!c.JWT_TOKEN) {
      res.writeHead(302, {
        "set-cookie": [serialize("JWT_TOKEN", "", {maxAge: 0})],
        "location": "http://localhost:3000/account",
      });
      return res.end();
    }

    /**
     * JWT (string type)
     */
    const jwt = c.JWT_TOKEN;
    const jwtP = JsonToken.getPayload(jwt!);

    /**
     * Additional info about a user
     */
    const uAddInfo = {
      company_type: f.form?.[0].value,
      company_name: f.form?.[1].value,
    };

    /**
     * Test MongoDB Database
     */
    const db = mongoClient.db("lotus");

    /**
     * Push new info
     */
    await db.collection("users").updateOne({user_id: jwtP.user_id}, [{$set: {company_name: uAddInfo.company_name}}, {$set: {company_type: uAddInfo.company_type}}, {$set: {first_sign: false}}]);

    res.writeHead(302, {
      "location" : "http://localhost:3000/participant",
    });
    return res.end();
  });
});

app.post("/trade/history/get", async (req, res)=> {
  const db = mongoClient.db("lotus");
  const list = await db.collection("trade_rooms").find().toArray();
  res.json(list);
});

app.post("/trade/room/user_status", (req, res)=> {
  const jwtP = JsonToken.getPayload(parse(req.headers.cookie!).JWT_TOKEN!);
  res.json(jwtP.admin ? {value: true} : {value: false});
});

app.post("/trade/room/user_id", (req, res)=> {
  const jwtP = JsonToken.getPayload(parse(req.headers.cookie!).JWT_TOKEN!);
  res.json({user_id: jwtP.user_id});
});


app.post("/trade/room/product_data", (req, res) => {
  let body = "";

  req.on("data", (chunk)=> {
    body += chunk;
  });

  req.on("end", async ()=> {
    const json = JSON.parse(body);

    const db = mongoClient.db("lotus");

    const roomData = await db.collection("trade_rooms").findOne({room_id: atob(json.room_id)});
  
    if (!roomData) {
      res.writeHead(500, "Internal server error");
      return res.end();
    }

    res.json(roomData);
  });
});

app.post("/trade/room/user/new", (req, res)=> {
  let body = "";

  req.on("data", (chunk)=>{
    body += chunk;
  });

  req.on("end", async ()=> {
    /**
     * Parsed form
     */
    const f = FormParser(body);

    if (!f.value) {
      res.writeHead(500, "Internal server error");
      return res.end();
    } 

    const db = mongoClient.db("lotus");

    let uInfo :any = {room_id:"", user_id:"", offer:{}};

    for (let i = 0; i < f.form?.length!; i++) {
      if (f.form) {
        if (f.form[i].name === "room_id" )  {
          uInfo.room_id = atob(f.form[i].value.toString());
        } else if (f.form[i].name === "user_id" )  {
          uInfo.user_id = f.form[i].value;
        } else {
          const n:any = f.form[i].value;
          uInfo.offer[n] = f.form[i].value;
        }
      }
    }

    console.log(uInfo);

    await db.collection("trade_rooms").updateOne({room_id: uInfo.room_id}, {$push: {active_users: uInfo}});

    res.end();
  });
});

//////////////////////////////////////////////
// APPLICATION END 
//////////////////////////////////////////////

//////////////////////////////////////////////
// SOCKET.IO START
//////////////////////////////////////////////

ioServer.on("connection", (socket) => {

  socket.on("msg", (msg)=> {
    console.log(msg)
  });

  socket.on("trade_room", (room)=> {
    console.log(`room is: ${room}`)
    socket.join(room);
  });

  socket.on("room_join_req", (data)=> {
    console.log(data);
    socket.broadcast.to(data.room_id).emit("connect_new_user", data.user_id);
  });
});

//////////////////////////////////////////////
// SOCKET.IO END
//////////////////////////////////////////////

server.on("close", async () => {
  await mongoClient.close();
});

server.listen(webPort, () => {
  console.log(`The proxy server is runnig on the port ${proxyPort}.\nWeb server is running on the port ${webPort}.\n`);
});
