"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const WelcomeMsg_1 = __importDefault(require("./WelcomeMsg/WelcomeMsg"));
const Login_1 = __importDefault(require("./Login/Login"));
require("./style/AdminLogin.css");
const AdminLogin = () => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "lf-container", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(WelcomeMsg_1.default, {}), (0, jsx_runtime_1.jsx)(Login_1.default, {})] }) }));
};
exports.default = AdminLogin;
