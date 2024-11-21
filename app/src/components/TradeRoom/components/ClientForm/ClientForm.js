"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const joinToRoom = (socket, room, userId) => {
    socket.emit("room_join_req", { room_id: room, user_id: userId });
};
const ClientForm = (props) => {
    const fid = "_form_3";
    let roomData = [];
    const btn = props.joinBtn;
    const [subClicked, setSubClicked] = react_1.default.useState(false);
    for (let key in props.rData) {
        roomData.push([key, props.rData[key]]);
    }
    return ((0, jsx_runtime_1.jsx)("div", { children: !subClicked
            ? (0, jsx_runtime_1.jsxs)("form", { id: fid, onSubmit: e => e.preventDefault(), children: [roomData.map((val, idx) => {
                        if (![
                            "product_name",
                            "description",
                            "status",
                            "room_id",
                            "room_name",
                            "users_q",
                            "_id",
                            "active_users",
                            "move_idx",
                            "active_session",
                        ].find(v => v === val[0])) {
                            return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: val[0] }), (0, jsx_runtime_1.jsx)("input", { name: val[0], type: "text" })] }, idx));
                        }
                    }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                console.log("clicked!");
                                const f = new FormData(document.getElementById(fid));
                                f.append("room_id", props.room_id);
                                f.append("user_id", props.user_id);
                                fetch("/trade/room/user/new", {
                                    method: "POST",
                                    body: f,
                                })
                                    .then(res => {
                                    if (res.ok) {
                                        console.log("Response is OK");
                                        return res.text();
                                    }
                                    else {
                                        console.log("Response is not OK");
                                    }
                                })
                                    .then(() => {
                                    joinToRoom(props.socket, props.room_id, props.user_id);
                                    if (btn)
                                        btn.disabled = true;
                                    setSubClicked(true);
                                })
                                    .catch(err => console.log(err));
                            }, children: "Submit" }) })] })
            : (0, jsx_runtime_1.jsx)("div", {}) }));
};
exports.default = ClientForm;
