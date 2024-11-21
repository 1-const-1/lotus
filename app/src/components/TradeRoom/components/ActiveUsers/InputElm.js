"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const InputElm = (props) => {
    const [inpValue, setInpValue] = react_1.default.useState(props.value);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "", children: props.label }), (0, jsx_runtime_1.jsx)("input", { name: props.label, value: inpValue, onChange: (e) => {
                    setInpValue(e.target.value);
                }, type: "text", readOnly: props.ro })] }));
};
exports.default = InputElm;
