"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const ClientForm_1 = __importDefault(require("../ClientForm/ClientForm"));
const ClientMenu = (props) => {
    let btn = react_1.default.useRef(null);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                            btn.current = e.target;
                            props.ufSetter(!props.ufBool);
                        }, children: "Join" }), (0, jsx_runtime_1.jsx)("button", { onClick: (e) => {
                            e.preventDefault();
                            if (btn.current)
                                btn.current.disabled = false;
                            fetch("/trade/room/user/leave", {
                                method: "POST",
                                body: JSON.stringify({
                                    room_id: props.room_id,
                                    user_id: props.user_id,
                                })
                            })
                                .then(res => {
                                if (res.redirected) {
                                    console.log(`You have just left, id: ${props.user_id}`);
                                    if (props.room_id && props.user_id) {
                                        props.socket.emit("user_make_move_req", { room_id: props.room_id, user_id: props.user_id }, props.activeUser, props.socket.id);
                                        props.socket.emit("trade_room_timer_start", { room_id: props.room_id }, 30, props.socket.id);
                                        props.socket.emit("user_leaves_req", { room_id: props.room_id, user_id: props.user_id });
                                    }
                                }
                                else {
                                    console.log("Response is not OK!");
                                }
                            })
                                .catch(err => console.log(err));
                        }, children: "Leave" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                            props.socket.emit("user_make_move_req", { room_id: props.room_id, user_id: props.user_id }, props.activeUser, props.socket.id);
                            props.socket.emit("trade_room_timer_start", { room_id: props.room_id }, 30, props.socket.id);
                        }, disabled: props.active_session && (props.activeUser === props.user_index) ? false : true, children: "Move" })] }), (0, jsx_runtime_1.jsx)("div", { children: props.ufBool
                    ? (0, jsx_runtime_1.jsx)(ClientForm_1.default, { room_id: props.room_id, user_id: props.user_id, rData: props.rData, socket: props.socket, joinBtn: btn.current, ufSetter: props.ufSetter })
                    : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) })] }));
};
exports.default = ClientMenu;
