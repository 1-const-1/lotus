"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DashboardHeader_1 = __importDefault(require("./Header/DashboardHeader"));
const DashboardMain_1 = __importDefault(require("./Main/DashboardMain"));
const updateClientToken_1 = require("../app/EventCallbacks/updateClientToken");
/**
 * Admin dashboard component
 * @returns
 */
const Dashboard = () => {
    (0, react_1.useEffect)(() => {
        (0, updateClientToken_1.updateAdminJsonToken)();
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-screen", children: [(0, jsx_runtime_1.jsx)(DashboardHeader_1.default, {}), (0, jsx_runtime_1.jsx)(DashboardMain_1.default, {})] }));
};
exports.default = Dashboard;
