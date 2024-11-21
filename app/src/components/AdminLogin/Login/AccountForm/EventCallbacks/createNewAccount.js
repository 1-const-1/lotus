"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccount = void 0;
const createNewAccount = (form) => {
    fetch("/a/signup", {
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
        }
    })
        .catch(err => console.log(err));
};
exports.createNewAccount = createNewAccount;
