"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const UserInterfaceHeader_1 = __importDefault(require("./Header/UserInterfaceHeader"));
const UserInterfaceMain_1 = __importDefault(require("./Main/UserInterfaceMain"));
const UserInterface = () => {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(UserInterfaceHeader_1.default, {}), (0, jsx_runtime_1.jsx)(UserInterfaceMain_1.default, {})] }));
};
exports.default = UserInterface;
