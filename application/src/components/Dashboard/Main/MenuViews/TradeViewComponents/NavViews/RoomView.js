"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const RoomViewContent_1 = __importDefault(require("./RoomViewContent/RoomViewContent"));
const RoomView = () => {
    const [clicked, setClicked] = (0, react_1.useState)(0);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-row w-full", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => { setClicked(1); }, className: "p-3 bg-sky-500 font-bold text-base text-center text-white", children: "Create room" }) }), (0, jsx_runtime_1.jsx)("div", { children: clicked ? (0, jsx_runtime_1.jsx)(RoomViewContent_1.default, {}) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) })] }));
};
exports.default = RoomView;
