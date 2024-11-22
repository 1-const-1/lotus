"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ActiveForms_1 = __importDefault(require("./ActiveForms"));
const ActiveUsers = (props) => {
    return ((0, jsx_runtime_1.jsx)("div", { children: props.rInfo.active_users && props.usersInfo
            ? props.rInfo.active_users.map((val, idx) => {
                return ((0, jsx_runtime_1.jsx)(ActiveForms_1.default, { move_idx: props.rInfo.move_idx, userOfferInfo: val, room_id: props.room_id, user_id: props.user_id, socket: props.socket, idx: idx, timer: props.timer, userInfo: props.usersInfo[idx] }, idx));
            })
            : "none..." }));
};
exports.default = ActiveUsers;
