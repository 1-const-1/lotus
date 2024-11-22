"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const RoomPrevieBlock = (props) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "product-block", children: [(0, jsx_runtime_1.jsx)("header", { children: (0, jsx_runtime_1.jsx)("h1", { children: props.roomData.room_name }) }), (0, jsx_runtime_1.jsxs)("main", { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Room size" }), (0, jsx_runtime_1.jsx)("p", { children: props.roomData.users_q })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Description" }), (0, jsx_runtime_1.jsx)("p", { children: props.roomData.description })] })] }), (0, jsx_runtime_1.jsx)("footer", { children: (0, jsx_runtime_1.jsx)("a", { href: `/trade/room?id=${btoa(props.roomData.room_id)}`, children: "Connect" }) })] }));
};
exports.default = RoomPrevieBlock;
