"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = void 0;
const createRoom = (form) => {
    fetch("/trade/room/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new FormData(form)
    })
        .then(res => {
        if (res.ok) {
            console.log("Response is OK!");
        }
        else {
            console.log("Response is not OK!");
        }
    })
        .catch(err => console.log(err));
};
exports.createRoom = createRoom;
