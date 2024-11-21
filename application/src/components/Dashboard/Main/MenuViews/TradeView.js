"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const NavigationMenu_1 = require("./TradeViewComponents/NavigationMenu");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const TradeView = () => {
    const socket = (0, socket_io_client_1.default)();
    socket.emit("msg", "Trade room emit.");
    const nav = NavigationMenu_1.TradeViewNav;
    const [viewId, setViewId] = (0, react_1.useState)(0);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("nav", { children: (0, jsx_runtime_1.jsx)("ul", { children: nav.map((val) => {
                            return (0, jsx_runtime_1.jsx)("li", { onClick: () => { setViewId(val.id); }, children: val.name }, val.id);
                        }) }) }) }), (0, jsx_runtime_1.jsx)("div", { children: viewId ? nav[viewId - 1].view : (0, jsx_runtime_1.jsx)("p", { children: "Empty" }) })] }));
};
exports.default = TradeView;
