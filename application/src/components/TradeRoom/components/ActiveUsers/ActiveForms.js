"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const InputElm_1 = __importDefault(require("./InputElm"));
const ChangeFormBtn_1 = __importDefault(require("./ChangeFormBtn"));
const SaveChagesBtn_1 = __importDefault(require("./SaveChagesBtn"));
const ActiveForms = (props) => {
    let arrElm = [];
    const [fid, setFid] = react_1.default.useState(`user_form_${props.userOfferInfo.user_id}`);
    const [tid, setTid] = react_1.default.useState(`user_timer_${props.userOfferInfo.user_id}`);
    const [offerInfo, setOfferInfo] = react_1.default.useState(props.userOfferInfo);
    const [rOnly, setReadOnly] = react_1.default.useState(true);
    for (let key in offerInfo.offer) {
        arrElm.push((0, jsx_runtime_1.jsx)(InputElm_1.default, { label: key, value: offerInfo.offer[key], ro: rOnly }, key));
    }
    if (offerInfo.user_id === props.user_id) {
        arrElm.push((0, jsx_runtime_1.jsx)(ChangeFormBtn_1.default, { rOnly: rOnly, rOnlySetter: setReadOnly }));
        arrElm.push((0, jsx_runtime_1.jsx)(SaveChagesBtn_1.default, { fid: fid, room_id: props.room_id, user_id: props.user_id, idx: props.idx, socket: props.socket }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { id: tid, children: props.move_idx === props.idx ? `00:${props.timer}` : "Wait..." }), (0, jsx_runtime_1.jsx)("form", { id: fid, className: props.move_idx === props.idx ? "bg-emerald-500" : "bg-gray-500", onSubmit: e => e.preventDefault(), children: arrElm
                    ? arrElm.map((val, idx) => {
                        return (0, jsx_runtime_1.jsx)("div", { children: val }, idx);
                    })
                    : (0, jsx_runtime_1.jsx)("p", { children: "Loading data..." }) })] }));
};
exports.default = ActiveForms;