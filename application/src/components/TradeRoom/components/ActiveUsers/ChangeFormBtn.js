"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ChangeFormBtn = (props) => {
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                props.rOnlySetter(!props.rOnly);
            }, children: "Change" }) }));
};
exports.default = ChangeFormBtn;
