"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const rx_1 = require("react-icons/rx");
const HistoryView = () => {
    const [mounted, setMounted] = (0, react_1.useState)(false);
    let roomsList = (0, react_1.useRef)([]);
    const thCol = [
        "Room name",
        "Max users",
        "Status",
        "Edit"
    ];
    (0, react_1.useEffect)(() => {
        fetch("/trade/history/get", {
            method: "POST"
        })
            .then(res => res.ok ? res.json() : console.error)
            .then(data => {
            roomsList.current = data;
            setMounted(true);
        })
            .catch(err => console.log(err));
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("table", { children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsx)("tr", { children: thCol.map((val, idx) => {
                            return (0, jsx_runtime_1.jsx)("th", { children: val }, idx);
                        }) }) }), (0, jsx_runtime_1.jsx)("tbody", { children: !mounted ? (0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { children: "Still loading..." }) }) :
                        roomsList.current.map((val, idx) => {
                            return ((0, jsx_runtime_1.jsxs)("tr", { id: `room-${idx}`, children: [(0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("a", { href: `/trade/room?id=${btoa(val.room_id.toString())}`, children: val.room_name }) }), (0, jsx_runtime_1.jsx)("td", { children: val.users_q }), (0, jsx_runtime_1.jsx)("td", { children: val.status ? "online" : "offline" }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("button", { children: (0, jsx_runtime_1.jsx)(rx_1.RxCross2, {}) }) })] }, idx));
                        }) })] }) }));
};
exports.default = HistoryView;
