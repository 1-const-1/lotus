"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const NavMenu_1 = require("./ListMenu/NavMenu");
require("./style/style.css");
/**
 * This is the main component of the dashboard
 * (main semantic element in HTML body)
 * @returns
 */
const DashboardMain = () => {
    /**
     * List of submenus
     */
    const nav = NavMenu_1.navMenu;
    const [sb, setSubmenu] = (0, react_1.useState)(0);
    return ((0, jsx_runtime_1.jsx)("main", { className: "h-full", children: (0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-row items-start", children: [(0, jsx_runtime_1.jsx)("div", { id: "dash-menu", children: (0, jsx_runtime_1.jsx)("ul", { className: "menu-list", children: nav.length ? nav.map((val, idx) => {
                            if (idx !== 0) {
                                return ((0, jsx_runtime_1.jsx)("li", { className: "list-elm py-4 indent-3 text-base", onClick: () => { setSubmenu(val.id); }, children: (0, jsx_runtime_1.jsx)("span", { children: val.name }) }, val.id));
                            }
                        }) : "Empty" }) }), (0, jsx_runtime_1.jsx)("div", { children: nav[sb].view })] }) }));
};
exports.default = DashboardMain;
