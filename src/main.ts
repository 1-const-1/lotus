"use strict";

import http from "http";
import httpProxy from "http-proxy";
import express from "express";

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

app.get("/", (req, res) => {
  res.json({"message": "Home page"});
});

app.get("/call", (req, res) => {
  res.json({"message": "call endpoint"});
});

server.listen(webPort, () => {
  console.log(`The proxy server is runnig on the port ${proxyPort}.\nWeb server is running on the port ${webPort}.\n`);
});
