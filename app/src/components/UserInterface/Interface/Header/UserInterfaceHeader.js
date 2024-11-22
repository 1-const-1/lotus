"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const md_1 = require("react-icons/md");
require("./style/UserInterfaceHeader.css");
const UserInterfaceHeader = () => {
    return ((0, jsx_runtime_1.jsx)("header", { children: (0, jsx_runtime_1.jsxs)("div", { className: "ui-header", children: [(0, jsx_runtime_1.jsx)("div", { className: "ln-container", children: (0, jsx_runtime_1.jsx)("p", { children: "LOTUS" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(md_1.MdAccountCircle, { className: "w-7 h-7" }) })] }) }));
};
exports.default = UserInterfaceHeader;
