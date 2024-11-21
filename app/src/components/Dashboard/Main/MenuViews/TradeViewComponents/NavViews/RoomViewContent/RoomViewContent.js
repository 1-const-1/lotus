"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = __importDefault(require("react-dom/client"));
const PeculiarityComonent_1 = __importDefault(require("./PeculiarityComponent/PeculiarityComonent"));
const createRoom_1 = require("./EventCallbacks/createRoom");
/**
 * This components return a view of one of submenus
 * of the parent menu (Trade) in Dashboard menu
 * @returns
 */
const RoomViewContent = () => {
    /**
     * The identifier for the form to create a new room
     */
    const formId = "_room_form";
    /**
     * The identifirer for a list element (div)
     * with peculiarities of a product or service
     */
    const pecListId = "_pec_list";
    /**
     * This array stores a list of peculiarties
     */
    const lPec = (0, react_1.useRef)([]);
    /**
     * This hook helps to set and complete keys, names, id of HTML elements
     * These HTML element are TSX components to describe peculiarities of
     * a product / service
     */
    const [pid, setPid] = (0, react_1.useState)(1);
    /**
     * A list element where all new peculiarities will be rendered
     */
    let lPecRoot = (0, react_1.useRef)(null);
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("form", { id: formId, onSubmit: (e) => { e.preventDefault(); }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "inp_1", children: "Room name" }), (0, jsx_runtime_1.jsx)("input", { className: "border", type: "text", name: "room_name", id: "inp_1" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "inp_2" }), (0, jsx_runtime_1.jsx)("input", { className: "border", type: "number", name: "users_q", id: "inp_2" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "inp_3", children: "Produc/Service name" }), (0, jsx_runtime_1.jsx)("input", { className: "border", type: "text", name: "product_name", id: "inp_3" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "inp_4", children: "Price" }), (0, jsx_runtime_1.jsx)("input", { className: "border", type: "text", name: "price", id: "inp_4" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "inp_5", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { name: "description", id: "inp_5" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("p", { children: "Product peculiarities" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { className: "p-3 bg-sky-500 font-bold text-base text-center text-white", onClick: () => {
                                    if (!lPecRoot.current) {
                                        lPecRoot.current = client_1.default.createRoot(document.getElementById(pecListId));
                                    }
                                    const cid = `_c_pec_${pid}`;
                                    const inpName = `pec_${pid}`;
                                    lPec.current.push((0, jsx_runtime_1.jsx)(PeculiarityComonent_1.default, { cid: cid, inpName: inpName, pecListId: pecListId, lPecRoot: lPecRoot, lPec: lPec }, cid));
                                    lPecRoot.current.render(lPec.current.map((val) => {
                                        return val;
                                    }));
                                    const newId = pid + 1;
                                    setPid(newId);
                                }, children: "Add" }) }), (0, jsx_runtime_1.jsx)("div", { id: pecListId })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { className: "p-3 bg-sky-500 font-bold text-base text-center text-white", onClick: () => {
                            const form = document.getElementById(formId);
                            (0, createRoom_1.createRoom)(form);
                        }, children: "Create" }) })] }) }));
};
exports.default = RoomViewContent;
