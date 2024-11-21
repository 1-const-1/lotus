"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const CompanyTypes_1 = require("./CompanyTypes");
const sendFirstSignForm_1 = require("./EventCallbacks/sendFirstSignForm");
const updateClientToken_1 = require("../../app/EventCallbacks/updateClientToken");
const checkFirstSignForm_1 = require("./EventCallbacks/checkFirstSignForm");
const FirstSignForm = () => {
    (0, react_1.useEffect)(() => {
        (0, updateClientToken_1.updateJsonToken)();
    }, []);
    (0, react_1.useEffect)(() => {
        (0, checkFirstSignForm_1.checkFirstSignForm)();
    }, []);
    const formId = "participant-form";
    const cTypes = CompanyTypes_1.enCompanyTypes;
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("form", { id: formId, onSubmit: (e) => { e.preventDefault(); }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "company-type" }), (0, jsx_runtime_1.jsx)("select", { name: "company_type", id: "company-type", children: cTypes.map((val, idx) => {
                                if (val.short !== "other")
                                    return (0, jsx_runtime_1.jsxs)("option", { value: val.short, children: [val.short, " ", val.full] }, idx);
                                else
                                    return (0, jsx_runtime_1.jsx)("option", { value: val.short, children: val.full }, idx);
                            }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "name", children: "Organization name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "company_name", id: "name" })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", { type: "submit", onClick: () => {
                            const f = document.getElementById(formId);
                            (0, sendFirstSignForm_1.sendFirstSignForm)(f);
                        }, children: "Save" }) }), (0, jsx_runtime_1.jsx)("p", { children: "You can change these parameteres in any time" })] }) }));
};
exports.default = FirstSignForm;
