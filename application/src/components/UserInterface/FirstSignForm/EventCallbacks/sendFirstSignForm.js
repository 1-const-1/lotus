"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFirstSignForm = void 0;
const sendFirstSignForm = (form) => {
    fetch("/participant/form", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new FormData(form),
    })
        .then(res => res.redirected ? window.location.href = res.url : console.log("Response is not OK!"))
        .catch(err => console.log(err));
};
exports.sendFirstSignForm = sendFirstSignForm;
