"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const createNewAccount_1 = require("./EventCallbacks/createNewAccount");
const CreateNew = (props) => {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "New account" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "signup", children: "Login" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "login", id: "signup", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "pass_signup", children: "Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", name: "pass", id: "pass_signup", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "pass_rep", children: "Repeat password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", name: "", id: "pass_rep", required: true })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { type: "submit", onClick: () => {
                        const form = document.getElementById(props.formId);
                        (0, createNewAccount_1.createNewAccount)(form);
                    }, children: "Create" }) })] }));
};
exports.default = CreateNew;
