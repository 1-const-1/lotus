"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginExistingAccount = void 0;
const loginExistingAccount = (form) => {
    fetch("/a/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new FormData(form),
    })
        .then(res => {
        if (res.redirected) {
            window.location.href = res.url;
        }
        else {
            console.log("Response is not OK!");
            ;
        }
    })
        .catch(err => console.log(err));
};
exports.loginExistingAccount = loginExistingAccount;
