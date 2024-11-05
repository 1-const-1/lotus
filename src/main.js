"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const express_1 = __importDefault(require("express"));
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
app.get("/", (req, res) => {
    res.json({ "message": "Home page" });
});
app.get("/call", (req, res) => {
    res.json({ "message": "call endpoint" });
});
server.listen(webPort, () => {
    console.log(`The proxy server is runnig on the port ${proxyPort}.\nWeb server is running on the port ${webPort}.\n`);
});
