"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./style/App.css");
const react_router_dom_1 = require("react-router-dom");
const LoginParticipant_1 = __importDefault(require("../Login/LoginParticipant"));
const UserInterface_1 = __importDefault(require("../UserInterface/Interface/UserInterface"));
const FirstSignForm_1 = __importDefault(require("../UserInterface/FirstSignForm/FirstSignForm"));
const Dashboard_1 = __importDefault(require("../Dashboard/Dashboard"));
const TradeRoom_1 = __importDefault(require("../TradeRoom/TradeRoom"));
const AdminLogin_1 = __importDefault(require("../AdminLogin/AdminLogin"));
const App = () => {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { future: {
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }, children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/account", element: (0, jsx_runtime_1.jsx)(LoginParticipant_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/participant/form", element: (0, jsx_runtime_1.jsx)(FirstSignForm_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/participant", element: (0, jsx_runtime_1.jsx)(UserInterface_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/a/dashboard", element: (0, jsx_runtime_1.jsx)(Dashboard_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/a", element: (0, jsx_runtime_1.jsx)(AdminLogin_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/trade/room", element: (0, jsx_runtime_1.jsx)(TradeRoom_1.default, {}) })] }) }));
};
exports.default = App;
