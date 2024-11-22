"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = __importDefault(require("react-dom/client"));
const AccountExists_1 = __importDefault(require("./AccountForm/AccountExists"));
const CreateNew_1 = __importDefault(require("./AccountForm/CreateNew"));
require("./style/style.css");
const Login = () => {
    const formId = "login-form";
    const modeId = "login-mode";
    const negativeSpan = "negative";
    let mode = (0, react_1.useRef)(true);
    let formRoot = (0, react_1.useRef)(null);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("form", { id: formId, onSubmit: (e) => { e.preventDefault(); }, children: mode.current ? (0, jsx_runtime_1.jsx)(AccountExists_1.default, { formId: formId }) : (0, jsx_runtime_1.jsx)(CreateNew_1.default, { formId: formId }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row", children: [(0, jsx_runtime_1.jsxs)("p", { className: "mr-1", children: ["If you ", (0, jsx_runtime_1.jsx)("span", { id: "negative", children: "do not" }), " have an account then"] }), (0, jsx_runtime_1.jsx)("a", { id: modeId, onClick: (e) => {
                            e.preventDefault();
                            if (!formRoot.current) {
                                formRoot.current = client_1.default.createRoot(document.getElementById(formId));
                            }
                            mode.current = !mode.current;
                            if (mode.current) {
                                formRoot.current.render((0, jsx_runtime_1.jsx)(AccountExists_1.default, { formId: formId }));
                            }
                            else {
                                formRoot.current.render((0, jsx_runtime_1.jsx)(CreateNew_1.default, { formId: formId }));
                            }
                            const statement = document.getElementById(negativeSpan);
                            const anchorMode = document.getElementById(modeId);
                            if (mode.current) {
                                anchorMode.textContent = "Sign up";
                            }
                            else {
                                statement.textContent = "do not";
                                anchorMode.textContent = "Login";
                            }
                        }, children: "Sign up" })] })] }));
};
exports.default = Login;
