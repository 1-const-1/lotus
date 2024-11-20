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
          const n:any = f.form[i].name;
          uInfo.offer[n] = f.form[i].value;
        }
      }
    }

    console.log(uInfo);

    await db.collection("trade_rooms").updateOne({room_id: uInfo.room_id}, {$push: {active_users: uInfo}});

    res.end();
  });
});

app.post("/trade/room/user/form_updated", (req,res)=> {
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

    let newUserInfo : any = {offer:{}};
    if (f.form) {
      for (let i = 0; i < f.form.length; i++) {
        const key = f.form[i].name;
        const val = f.form[i].value;
        if (key !== "room_id" && key !== "user_id" && key !== "index") {
          newUserInfo["offer"][key] = val;
        } else {
          newUserInfo[key] = val;
        }
      }
    }

    const db = mongoClient.db("lotus");

    console.log(newUserInfo);

    await db.collection("trade_rooms").updateOne({room_id: atob(newUserInfo.room_id)},{$set: {[`active_users.${newUserInfo.index}.offer`]: newUserInfo.offer}})

    res.end();
  });
});

app.post("/trade/room/user/leave", (req, res)=> {
  let body = "";

  req.on("data", (chunk)=>{
    body += chunk;
  });

  req.on("end", async ()=> {
    const jData = JSON.parse(body);

    jData.room_id = atob(jData.room_id);

    const db = mongoClient.db("lotus");

    const oldArr = await db.collection("trade_rooms").findOne({room_id: jData.room_id});
    if (oldArr) {
      const uIdx = oldArr.active_users.findIndex((val:any)=> val.user_id === jData.user_id);
      if (uIdx > -1) {     
        oldArr.active_users.splice(uIdx, 1);
        await db.collection("trade_rooms").updateOne({room_id: jData.room_id}, {$set: {active_users: oldArr.active_users}});
        console.log("The dependent offer was deleted!")
      } 
      console.log("A user have just left the room.");
    }

    res.writeHead(302, {
      "location" : "/participant",
    })
    res.end();
  });
});

app.post("/trade/room/user/move", (req, res)=> {
  let body = "";
  let newMove = 0;

  req.on("data", (chunk)=>{
    body += chunk;
  });

  req.on("end", async ()=> {
    const jData = JSON.parse(body);

    jData.room_id = atob(jData.room_id);

    const db = mongoClient.db("lotus");

    const room = await db.collection("trade_rooms").findOne({room_id: jData.room_id});

    if (room){
      if (jData.move_idx+1 > room.active_users.length) {
        newMove = 0;
      } else {
        newMove = jData.move_idx;
      }
    }

    await db.collection("trade_rooms").updateOne({room_id: jData.room_id}, {$set: {move_idx: newMove}});
    
    console.log(`New move: ${newMove}`);

    res.json({move_idx: newMove});
  });
});

app.post("/trade/room/user/index", (req, res)=> {
  let body = "";

  req.on("data", (chunk)=>{
    body += chunk;
  });

  req.on("end", async () => {
    const jData = JSON.parse(body);

    jData.room_id = atob(jData.room_id);

    const db = mongoClient.db("lotus");

    const room = await db.collection("trade_rooms").findOne({room_id: jData.room_id});
    let uIdx = 0;
    if (room) {
      uIdx = room.active_users.findIndex((val:any)=> val.user_id === jData.user_id);
    }

    res.json({user_index: uIdx});
  });
});

//////////////////////////////////////////////
// APPLICATION END 
//////////////////////////////////////////////

//////////////////////////////////////////////
// SOCKET.IO START
//////////////////////////////////////////////

let timerIsRunning = false;

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
    ioServer.to(data.room_id).emit("connect_new_user", data.user_id);
  });

  socket.on("user_leaves_req", (data)=> {
    console.log(data);
    ioServer.to(data.room_id).emit("user_leaves_evt", data.user_id);
  });

  socket.on("user_changes_offer_req", (data)=> {
    console.log(data);
    ioServer.to(data.room_id).emit("user_changes_offer_evt", data.user_id);
  });

  socket.on("user_make_move_req", (data, moveIdx, socket_id)=> {
    console.log(`Move idx: ${moveIdx}\nSocket id: ${socket_id}`);

    const request = http.request({
      method: "POST",
      host: "127.0.0.1",
      port: 3000,
      path: "/trade/room/user/move" ,
      headers: {
        "content-type" : "application/json",
      },
    }, (res)=> {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        const jData = JSON.parse(body);
        console.log(jData);

        ioServer.to(data.room_id).emit("user_make_move_evt", jData);

      });
    });

    request.write(JSON.stringify({
      room_id: data.room_id,
      user_id: data.user_id,
      move_idx: ++moveIdx,
    }));
    request.end();
  });

  socket.on("trade_room_timer_start", (data, time, socket_id) => {
    let socketTimer = time;  
    console.log(socket_id);
    const resInterval = setInterval(
      ()=> {
        if (!socketTimer) {  
          const skSet = ioServer.sockets.adapter.rooms.get(data.room_id);
          console.log("Set:", skSet);
          
          const skList :any[] = []
          
          for (const val of skSet!) {
            skList.push(val);
          }
          
          console.log(skList);

          let skNextIdx = skList.findIndex((val:string)=> val === socket_id);          
          skNextIdx = skNextIdx+1 > skList.length-1 ? 0 :skNextIdx+1;

          console.log("Found index: ", skNextIdx);

          ioServer.emit("trade_room_timer_end", data, skList[skNextIdx]);

          clearInterval(resInterval);
        }

        ioServer.to(data.room_id).emit("trade_room_timer_res", socketTimer);
        --socketTimer;
             
        console.log(socketTimer);
      }, 1000
    );
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
