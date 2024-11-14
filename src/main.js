"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = require("./mongo");
const http_1 = __importDefault(require("http"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const form_parser_1 = require("./custom_packages/form-parser/form-parser");
const createAccount_1 = require("./methods/account/createAccount");
const refreshToken_1 = require("./methods/jwt/refreshToken");
const uuid_1 = require("uuid");
const jsonToken_1 = require("./methods/jwt/jsonToken");
const cookie_1 = require("cookie");
const checkCredentials_1 = require("./methods/account/checkCredentials");
const updateJWT_1 = require("./methods/jwt/updateJWT");
const checkDataToCreateRoom_1 = require("./methods/dashboard/trades/checkDataToCreateRoom");
const webPort = 6000;
const proxyPort = 8000;
/**
 * Proxy server to interact with React application
 */
http_proxy_1.default.createProxyServer({ target: `http://localhost:${webPort}` }).listen(proxyPort);
/**
 * Set server with express framework
 */
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const ioServer = new socket_io_1.Server(server);
//////////////////////////////////////////////
// APPLICATION ROUTES START
//////////////////////////////////////////////
app.get("/", (req, res) => {
    res.json({ "message": "Home page" });
});
app.get("/call", (req, res) => {
    res.json({ "message": "call endpoint" });
});
app.get("/account", (req, res) => {
    res.json({ "message": "account page" });
});
/**
 * The main user interface
 */
app.get("/participant", (req, res) => {
    const c = (0, cookie_1.parse)(req.headers.cookie);
    if (!c.JWT_TOKEN) {
        res.writeHead(302, {
            "set-cookie": [(0, cookie_1.serialize)("JWT_TOKEN", "", { maxAge: 0 })],
            "location": "http://localhost:3000/account",
        });
        res.end();
    }
    res.end();
});
app.get("/participant/form", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const c = (0, cookie_1.parse)(req.headers.cookie);
    if (!c.JWT_TOKEN) {
        res.writeHead(302, {
            "set-cookie": [(0, cookie_1.serialize)("JWT_TOKEN", "", { maxAge: 0 })],
            "location": "http://localhost:3000/account",
        });
        res.end();
    }
    const jwtP = jsonToken_1.JsonToken.getPayload(c.JWT_TOKEN);
    const db = mongo_1.mongoClient.db("lotus");
    const uData = yield db.collection("users").findOne({ user_id: jwtP === null || jwtP === void 0 ? void 0 : jwtP.user_id });
    if (!(uData === null || uData === void 0 ? void 0 : uData.first_sign)) {
        res.writeHead(302, {
            "location": "http://localhost:3000/participant",
        });
    }
    res.end();
}));
/**
 * Update a session token (JWT)
 */
app.get("/token/admin", (req, res) => {
    var _a;
    const result = (0, updateJWT_1.updateJWT)(req.headers.cookie);
    if (!result.value) {
        res.writeHead(302, {
            "set-cookie": [(0, cookie_1.serialize)("JWT_TOKEN", "", { maxAge: 0 })],
            "location": "http://localhost:3000/account",
        });
    }
    if (result.value === 2) {
        res.writeHead(200, {
            "set-cookie": [(0, cookie_1.serialize)("JWT_TOKEN", (_a = result.newJwt) === null || _a === void 0 ? void 0 : _a.info().jwt, { httpOnly: true, maxAge: 60 * 60 * 3.15 })],
        });
    }
    ;
    res.end();
});
/**
 * Update a session token (JWT)
 */
app.get("/token", (req, res) => {
    var _a;
    const result = (0, updateJWT_1.updateJWT)(req.headers.cookie);
    if (!result.value) {
        res.writeHead(302, {
            "set-cookie": [(0, cookie_1.serialize)("JWT_TOKEN", "", { maxAge: 0 })],
            "location": "http://localhost:3000/account",
        });
    }
    if (result.value === 2) {
        res.writeHead(200, {
            "set-cookie": [(0, cookie_1.serialize)("JWT_TOKEN", (_a = result.newJwt) === null || _a === void 0 ? void 0 : _a.info().jwt, { httpOnly: true, maxAge: 60 * 60 * 3.15 })],
        });
    }
    ;
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
        const f = (0, form_parser_1.FormParser)(body);
        if (!f.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        /**
         * Checker variable for methods
         */
        let result;
        result = (0, checkDataToCreateRoom_1.checkDataToCreateRoom)(f.form);
        if (!result.value) {
            res.writeHead(500, "Invalid data");
            return res.end();
        }
        /**
         * Test MongoDB Database
         */
        const db = mongo_1.mongoClient.db("lotus");
        db.collection("trade_rooms").insertOne(result.data);
        return res.end();
    });
});
app.post("/account/login", (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        /**
         * Parsed form
         */
        const f = (0, form_parser_1.FormParser)(body);
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
        let uOption;
        uOption = {
            login: f.form ? f.form[0].value.toString() : "",
            pass: f.form ? f.form[1].value.toString() : "",
        };
        result = yield (0, checkCredentials_1.checkCredential)(uOption);
        if (!result.value) {
            res.writeHead(403, "Invalid data");
            return res.end();
        }
        /**
         * Test MongoDB Database
         */
        const db = mongo_1.mongoClient.db("lotus");
        /**
         * Get user data to compare the entered and stored passwords
         */
        let uData = yield db.collection("users").findOne({ login: uOption.login });
        if (!uData) {
            res.writeHead(403, "Invalid data");
            return res.end();
        }
        /**
         * Check if a user has an old refresh token not to create another one
         */
        const oldRT = yield db.collection("refresh_token").findOne({ user_id: uData === null || uData === void 0 ? void 0 : uData.user_id });
        let rToken = new refreshToken_1.RefreshToken();
        result = rToken.generate(uData === null || uData === void 0 ? void 0 : uData.user_id);
        if (!result.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        let rtInfo = rToken.info();
        result = rToken.generate(uData === null || uData === void 0 ? void 0 : uData.user_id);
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
                user_id: rtInfo.user_id,
                token: rtInfo.bhash
            });
        }
        else {
            db.collection("refresh_token").updateOne({ user_id: uData === null || uData === void 0 ? void 0 : uData.user_id }, { $set: { token: rtInfo.bhash } });
        }
        /**
         * A new json web token
         */
        const jwt = new jsonToken_1.JsonToken();
        const jwtP = {
            user_id: uData === null || uData === void 0 ? void 0 : uData.user_id,
            login: uOption.login,
            refresh_token: rtInfo.token,
        };
        result = jwt.generate("sha256", jwtP, "TEST_SECRET_KEY");
        if (!result.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        const jwtInfo = jwt.info();
        res.writeHead(302, {
            "Set-Cookie": [(0, cookie_1.serialize)("JWT_TOKEN", jwtInfo.jwt, { path: "/", httpOnly: true, maxAge: 60 * 60 * 3.15, })],
            "Location": "http://localhost:3000/participant",
        });
        return res.end();
    }));
});
app.post("/account/signup", (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        /**
         * Parsed form
         */
        const f = (0, form_parser_1.FormParser)(body);
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
        let uOption;
        uOption = {
            user_id: (0, uuid_1.v4)(),
            login: f.form ? f.form[0].value.toString() : "",
            pass: f.form ? f.form[1].value.toString() : "",
        };
        result = yield (0, createAccount_1.createAccount)(uOption);
        if (!result.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        /**
         * Test MongoDB Database
         */
        const db = mongo_1.mongoClient.db("lotus");
        /**
         * New Refresh token
         */
        let rToken = new refreshToken_1.RefreshToken();
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
        const jwt = new jsonToken_1.JsonToken();
        const jwtP = {
            user_id: uOption.user_id,
            login: uOption.login,
            refresh_token: rtInfo.token,
        };
        result = jwt.generate("sha256", jwtP, "TEST_SECRET_KEY");
        if (!result.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        const jwtInfo = jwt.info();
        res.writeHead(302, {
            "Set-Cookie": [(0, cookie_1.serialize)("JWT_TOKEN", jwtInfo.jwt, { path: "/", httpOnly: true, maxAge: 60 * 60 * 3.15, })],
            "Location": "http://localhost:3000/participant/form",
        });
        return res.end();
    }));
});
app.post("/a/signup", (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        /**
         * Parsed form
         */
        const f = (0, form_parser_1.FormParser)(body);
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
        let uOption;
        uOption = {
            user_id: (0, uuid_1.v4)(),
            login: f.form ? f.form[0].value.toString() : "",
            pass: f.form ? f.form[1].value.toString() : "",
        };
        result = yield (0, createAccount_1.createAccount)(uOption);
        if (!result.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        /**
         * Test MongoDB Database
         */
        const db = mongo_1.mongoClient.db("lotus");
        /**
         * New Refresh token
         */
        let rToken = new refreshToken_1.RefreshToken();
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
        const jwt = new jsonToken_1.JsonToken();
        const jwtP = {
            user_id: uOption.user_id,
            login: uOption.login,
            refresh_token: rtInfo.token,
            admin: "true",
        };
        result = jwt.generate("sha256", jwtP, "TEST_SECRET_KEY");
        if (!result.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        const jwtInfo = jwt.info();
        res.writeHead(302, {
            "Set-Cookie": [(0, cookie_1.serialize)("JWT_TOKEN", jwtInfo.jwt, { path: "/", httpOnly: true, maxAge: 60 * 60 * 3.15, })],
            "Location": "http://localhost:3000/a/dashboard",
        });
        return res.end();
    }));
});
app.post("/a/login", (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        /**
         * Parsed form
         */
        const f = (0, form_parser_1.FormParser)(body);
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
        let uOption;
        uOption = {
            login: f.form ? f.form[0].value.toString() : "",
            pass: f.form ? f.form[1].value.toString() : "",
        };
        result = yield (0, checkCredentials_1.checkCredential)(uOption);
        if (!result.value) {
            res.writeHead(403, "Invalid data");
            return res.end();
        }
        /**
         * Test MongoDB Database
         */
        const db = mongo_1.mongoClient.db("lotus");
        /**
         * Get user data to compare the entered and stored passwords
         */
        let uData = yield db.collection("users").findOne({ login: uOption.login });
        if (!uData) {
            res.writeHead(403, "Invalid data");
            return res.end();
        }
        /**
         * Check if a user has an old refresh token not to create another one
         */
        const oldRT = yield db.collection("refresh_token").findOne({ user_id: uData === null || uData === void 0 ? void 0 : uData.user_id });
        let rToken = new refreshToken_1.RefreshToken();
        result = rToken.generate(uData === null || uData === void 0 ? void 0 : uData.user_id);
        if (!result.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        let rtInfo = rToken.info();
        result = rToken.generate(uData === null || uData === void 0 ? void 0 : uData.user_id);
        if (!result.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        /**
         * if a refresh token exists then it update it or it create another one
         */
        if (!(oldRT === null || oldRT === void 0 ? void 0 : oldRT.user_id)) {
            db.collection("refresh_token").insertOne({
                id: rtInfo.id,
                user_id: rtInfo.user_id,
                token: rtInfo.bhash
            });
        }
        else {
            db.collection("refresh_token").updateOne({ user_id: uData === null || uData === void 0 ? void 0 : uData.user_id }, { $set: { token: rtInfo.bhash } });
        }
        /**
         * A new json web token
         */
        const jwt = new jsonToken_1.JsonToken();
        const jwtP = {
            user_id: uData === null || uData === void 0 ? void 0 : uData.user_id,
            login: uOption.login,
            refresh_token: rtInfo.token,
            admin: "true",
        };
        result = jwt.generate("sha256", jwtP, "TEST_SECRET_KEY");
        if (!result.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        const jwtInfo = jwt.info();
        res.writeHead(302, {
            "Set-Cookie": [(0, cookie_1.serialize)("JWT_TOKEN", jwtInfo.jwt, { path: "/", httpOnly: true, maxAge: 60 * 60 * 3.15, })],
            "Location": "http://localhost:3000/a/dashboard",
        });
        return res.end();
    }));
});
app.post("/participant/form", (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        /**
         * Parsed form
         */
        const f = (0, form_parser_1.FormParser)(body);
        if (!f.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        const c = (0, cookie_1.parse)(req.headers.cookie);
        if (!c.JWT_TOKEN) {
            res.writeHead(302, {
                "set-cookie": [(0, cookie_1.serialize)("JWT_TOKEN", "", { maxAge: 0 })],
                "location": "http://localhost:3000/account",
            });
            return res.end();
        }
        /**
         * JWT (string type)
         */
        const jwt = c.JWT_TOKEN;
        const jwtP = jsonToken_1.JsonToken.getPayload(jwt);
        /**
         * Additional info about a user
         */
        const uAddInfo = {
            company_type: (_a = f.form) === null || _a === void 0 ? void 0 : _a[0].value,
            company_name: (_b = f.form) === null || _b === void 0 ? void 0 : _b[1].value,
        };
        /**
         * Test MongoDB Database
         */
        const db = mongo_1.mongoClient.db("lotus");
        /**
         * Push new info
         */
        yield db.collection("users").updateOne({ user_id: jwtP.user_id }, [{ $set: { company_name: uAddInfo.company_name } }, { $set: { company_type: uAddInfo.company_type } }, { $set: { first_sign: false } }]);
        res.writeHead(302, {
            "location": "http://localhost:3000/participant",
        });
        return res.end();
    }));
});
app.post("/trade/history/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = mongo_1.mongoClient.db("lotus");
    const list = yield db.collection("trade_rooms").find().toArray();
    res.json(list);
}));
app.post("/trade/room/user_status", (req, res) => {
    const jwtP = jsonToken_1.JsonToken.getPayload((0, cookie_1.parse)(req.headers.cookie).JWT_TOKEN);
    res.json(jwtP.admin ? { value: true } : { value: false });
});
app.post("/trade/room/user_id", (req, res) => {
    const jwtP = jsonToken_1.JsonToken.getPayload((0, cookie_1.parse)(req.headers.cookie).JWT_TOKEN);
    res.json({ user_id: jwtP.user_id });
});
app.post("/trade/room/product_data", (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        const json = JSON.parse(body);
        const db = mongo_1.mongoClient.db("lotus");
        const roomData = yield db.collection("trade_rooms").findOne({ room_id: atob(json.room_id) });
        if (!roomData) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        res.json(roomData);
    }));
});
app.post("/trade/room/user/new", (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        /**
         * Parsed form
         */
        const f = (0, form_parser_1.FormParser)(body);
        if (!f.value) {
            res.writeHead(500, "Internal server error");
            return res.end();
        }
        const db = mongo_1.mongoClient.db("lotus");
        let uInfo = { room_id: "", user_id: "", offer: {} };
        for (let i = 0; i < ((_a = f.form) === null || _a === void 0 ? void 0 : _a.length); i++) {
            if (f.form) {
                if (f.form[i].name === "room_id") {
                    uInfo.room_id = atob(f.form[i].value.toString());
                }
                else if (f.form[i].name === "user_id") {
                    uInfo.user_id = f.form[i].value;
                }
                else {
                    const n = f.form[i].value;
                    uInfo.offer[n] = f.form[i].value;
                }
            }
        }
        console.log(uInfo);
        yield db.collection("trade_rooms").updateOne({ room_id: uInfo.room_id }, { $push: { active_users: uInfo } });
        res.end();
    }));
});
//////////////////////////////////////////////
// APPLICATION END 
//////////////////////////////////////////////
//////////////////////////////////////////////
// SOCKET.IO START
//////////////////////////////////////////////
ioServer.on("connection", (socket) => {
    socket.on("msg", (msg) => {
        console.log(msg);
    });
    socket.on("trade_room", (room) => {
        console.log(`room is: ${room}`);
        socket.join(room);
    });
    socket.on("room_join_req", (data) => {
        console.log(data);
        socket.broadcast.to(data.room_id).emit("connect_new_user", data.user_id);
    });
});
//////////////////////////////////////////////
// SOCKET.IO END
//////////////////////////////////////////////
server.on("close", () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongo_1.mongoClient.close();
}));
server.listen(webPort, () => {
    console.log(`The proxy server is runnig on the port ${proxyPort}.\nWeb server is running on the port ${webPort}.\n`);
});
