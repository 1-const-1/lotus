"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminJsonToken = exports.updateJsonToken = void 0;
const updateJsonToken = () => {
    fetch("/token", { method: "GET" })
        .then(res => {
        if (res.redirected) {
            window.location.href = res.url;
        }
        else if (res.ok) {
            console.log("Response is OK!");
        }
        else {
            console.log("Response is not OK!");
        }
    })
        .catch(err => console.log(err));
};
exports.updateJsonToken = updateJsonToken;
const updateAdminJsonToken = () => {
    fetch("/token/admin", { method: "GET" })
        .then(res => {
        if (res.redirected) {
            window.location.href = res.url;
        }
        else if (res.ok) {
            console.log("Response is OK!");
        }
        else {
            console.log("Response is not OK!");
        }
    })
        .catch(err => console.log(err));
};
exports.updateAdminJsonToken = updateAdminJsonToken;
