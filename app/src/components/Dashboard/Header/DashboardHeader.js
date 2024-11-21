"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const io5_1 = require("react-icons/io5");
const io_1 = require("react-icons/io");
/**
 * This is the header of the dashboard component
 * @returns
 */
const DashboardHeader = () => {
    let menuClicked = (0, react_1.useRef)(false);
    return ((0, jsx_runtime_1.jsx)("header", { children: (0, jsx_runtime_1.jsxs)("div", { className: "py-4 bg-sky-500 text-white flex flex-row justify-evenly align-middle", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { className: "flex items-center", onClick: () => {
                            const menu = document.getElementById("dash-menu");
                            menuClicked.current = !menuClicked.current;
                            if (menu) {
                                if (menuClicked) {
                                    menu.style.width = 128 + "px";
                                }
                                else {
                                    menu.style.width = 0 + "px";
                                }
                            }
                        }, children: (0, jsx_runtime_1.jsx)(io5_1.IoMenuOutline, { className: "w-8 h-8" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "font-bold text-2xl w-9/12 text-center", children: "Dashboard" }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { className: "flex items-center", children: (0, jsx_runtime_1.jsx)(io_1.IoIosLogOut, { className: "w-8 h-8" }) }) })] }) }));
};
exports.default = DashboardHeader;
