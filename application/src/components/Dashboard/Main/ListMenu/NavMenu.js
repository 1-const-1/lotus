"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.navMenu = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const DefaultView_1 = __importDefault(require("../MenuViews/DefaultView"));
const TradeView_1 = __importDefault(require("../MenuViews/TradeView"));
/**
 * The list of all available submenus
 */
exports.navMenu = [
    {
        id: 0,
        name: "Default",
        view: (0, jsx_runtime_1.jsx)(DefaultView_1.default, {}),
    },
    {
        id: 1,
        name: "Trade",
        view: (0, jsx_runtime_1.jsx)(TradeView_1.default, {}),
    },
];
