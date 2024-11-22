"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const loginExistingAccount_1 = require("./EventCallbacks/loginExistingAccount");
const AccountExists = (props) => {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Account" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "login", children: "Login" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "login", id: "login", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "pass_login", children: "Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", name: "pass", id: "pass_login", required: true })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { type: "submit", onClick: () => {
                        const form = document.getElementById(props.formId);
                        (0, loginExistingAccount_1.loginExistingAccount)(form);
                    }, children: "Enter" }) })] }));
};
exports.default = AccountExists;
