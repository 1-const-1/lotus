"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const AdminMenu = (props) => {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: (() => {
                    props.socket.emit("trade_room_session_start_req", { room_id: props.room_id });
                    props.socket.emit("trade_room_timer_start", { room_id: props.room_id }, 30, props.socket.id);
                }), disabled: !props.active_session ? false : true, children: "START TRADES" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                    props.socket.emit("trade_room_session_end_req", { room_id: props.room_id });
                    props.socket.emit("trade_room_timer_start", { room_id: props.room_id }, 30, props.socket.id, true);
                }, disabled: props.active_session ? false : true, children: "STOP TRADES" })] }));
};
exports.default = AdminMenu;
