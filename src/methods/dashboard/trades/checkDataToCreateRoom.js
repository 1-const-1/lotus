"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDataToCreateRoom = void 0;
const uuid_1 = require("uuid");
const checkDataToCreateRoom = (form) => {
    if (!form.length) {
        return {
            status: "error",
            msg: "form does not contain any element",
            data: null,
            value: 0,
        };
    }
    let modified = {
        room_id: (0, uuid_1.v4)(),
        status: false,
        active_users: [],
        move_idx: 0,
    };
    for (let idx = 0; idx < form.length; idx++) {
        if (!form[idx].value) {
            return {
                status: "error",
                msg: "form value cannot be empty",
                data: null,
                value: 0,
            };
        }
        modified[form[idx].name] = form[idx].value;
    }
    return {
        status: "success",
        msg: "data prepared correctly",
        data: modified,
        value: 1,
    };
};
exports.checkDataToCreateRoom = checkDataToCreateRoom;
