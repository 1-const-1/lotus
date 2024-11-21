"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DefaultView = () => {
    const [viewId, setViewId] = (0, react_1.useState)(0);
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { children: "Empty" }) }));
};
exports.default = DefaultView;
