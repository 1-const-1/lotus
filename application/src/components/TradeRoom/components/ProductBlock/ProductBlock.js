"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ProductBlock = (props) => {
    if (!props.rInfo) {
        return (0, jsx_runtime_1.jsx)("div", { children: "No data..." });
    }
    let roomData = [];
    for (let key in props.rInfo) {
        roomData.push([key, props.rInfo[key]]);
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 border-2", children: props.rInfo
            ? roomData.map((val, idx) => {
                if (val[0] === "product_name") {
                    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: "Product" }), (0, jsx_runtime_1.jsx)("h1", { children: val[1] })] }, idx));
                }
                else if (val[0] === "description") {
                    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: "Description" }), (0, jsx_runtime_1.jsx)("h1", { children: val[1] })] }, idx));
                }
                else if (val[0] === "price") {
                    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: "Price" }), (0, jsx_runtime_1.jsx)("h1", { children: val[1] })] }), (0, jsx_runtime_1.jsx)("div", { children: "Peculiarities" })] }, idx));
                }
                else if (val[0] !== "status"
                    && val[0] !== "room_id"
                    && val[0] !== "room_name"
                    && val[0] !== "users_q"
                    && val[0] !== "_id"
                    && val[0] !== "active_users"
                    && val[0] !== "move_idx") {
                    return (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("p", { children: val[1] }) }, idx);
                }
            }) : "Load data about product..." }));
};
exports.default = ProductBlock;
