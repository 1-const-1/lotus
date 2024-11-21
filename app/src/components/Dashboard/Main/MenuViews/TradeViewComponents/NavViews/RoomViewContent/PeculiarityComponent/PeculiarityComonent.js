"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const rx_1 = require("react-icons/rx");
const PeculiarityComponent = (props) => {
    return ((0, jsx_runtime_1.jsxs)("div", { id: props.cid, className: "", children: [(0, jsx_runtime_1.jsx)("input", { className: "border", type: "text", name: props.inpName }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                    var _a;
                    const parent = document.getElementById(props.pecListId);
                    const children = parent === null || parent === void 0 ? void 0 : parent.childNodes;
                    if (children === null || children === void 0 ? void 0 : children.length) {
                        for (let i = 0; i < (children === null || children === void 0 ? void 0 : children.length); i++) {
                            const elm = children[i];
                            if (elm.id === props.cid) {
                                props.lPec.current.splice(i, 1);
                                break;
                            }
                        }
                        (_a = props.lPecRoot.current) === null || _a === void 0 ? void 0 : _a.render(props.lPec.current.map((val) => {
                            return val;
                        }));
                    }
                }, children: (0, jsx_runtime_1.jsx)(rx_1.RxCross2, { className: "w-4 h-4 stroke-red-600" }) })] }));
};
exports.default = PeculiarityComponent;
