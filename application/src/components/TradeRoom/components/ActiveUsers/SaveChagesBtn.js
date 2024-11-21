"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const userChangesOffer = (socket, data) => {
    socket.emit("user_changes_offer_req", data);
};
const fetchChanges = (fid, socket, data) => {
    const f = new FormData(document.getElementById(fid));
    f.append("room_id", data.room_id);
    f.append("user_id", data.user_id);
    f.append("index", `${data.idx}`);
    fetch("/trade/room/user/form_updated", {
        method: "POST",
        body: f,
    })
        .then(res => {
        if (res.ok) {
            console.log("Response is OK!");
            userChangesOffer(socket, { room_id: data.room_id, user_id: data.user_id });
        }
        else {
            console.log("Response is not OK!");
        }
    })
        .catch(err => console.log(err));
};
const SaveChangesBtn = (props) => {
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                fetchChanges(props.fid, props.socket, { room_id: props.room_id, user_id: props.user_id, idx: props.idx });
            }, children: "Save" }) }));
};
exports.default = SaveChangesBtn;
