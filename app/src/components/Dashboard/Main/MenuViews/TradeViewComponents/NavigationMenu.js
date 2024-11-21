"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeViewNav = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const HistoryView_1 = __importDefault(require("./NavViews/HistoryView"));
const RoomView_1 = __importDefault(require("./NavViews/RoomView"));
exports.TradeViewNav = [
    {
        id: 1,
        name: "Room",
        view: (0, jsx_runtime_1.jsx)(RoomView_1.default, {}),
    },
    {
        id: 2,
        name: "History",
        view: (0, jsx_runtime_1.jsx)(HistoryView_1.default, {}),
    }
];
