"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const RoomPrevieBlock_1 = __importDefault(require("./components/RoomPrevieBlock/RoomPrevieBlock"));
require("./style/UserInterfaceMain.css");
const UserInterfaceMain = () => {
    const [mounted, setMounted] = react_1.default.useState(false);
    let roomsList = react_1.default.useRef([]);
    react_1.default.useEffect(() => {
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
    return ((0, jsx_runtime_1.jsx)("main", { className: "list-rooms", children: (0, jsx_runtime_1.jsx)("div", { children: !mounted ? "Still loading..." :
                roomsList.current.map((val, idx) => {
                    return (0, jsx_runtime_1.jsx)(RoomPrevieBlock_1.default, { roomData: val }, idx);
                }) }) }));
};
exports.default = UserInterfaceMain;
