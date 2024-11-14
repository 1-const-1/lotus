"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormParser = void 0;
const FormParser = (form) => {
    let f = form.split("\r\n");
    const fBoundary = f[0];
    let boundaryFound = false;
    const gap = "";
    let gapFound = false;
    let name = "";
    let nameRegexp = /name="(.*)"/;
    let nameSet = false;
    let value = "";
    let FormValues = [];
    for (let i = 0; i < f.length; i++) {
        // check boundaries
        if (f[i] === fBoundary) {
            boundaryFound = true;
            continue;
        }
        // check name
        if (boundaryFound && !nameSet) {
            const match = f[i].match(nameRegexp);
            if (match) {
                name = match[1];
                nameSet = true;
                continue;
            }
            else {
                return {
                    "status": "error",
                    "msg": "unknown name attribute",
                    "value": 0,
                    "form": null,
                };
            }
        }
        // check gap between properties and value
        if (boundaryFound && nameSet && !gapFound) {
            if (f[i] === gap) {
                gapFound = true;
                continue;
            }
            else {
                return {
                    "status": "error",
                    "msg": "can't find gap between properties and the main value",
                    "value": 0,
                    "form": null,
                };
            }
        }
        if (boundaryFound && nameSet && gapFound) {
            value = f[i].trim();
            FormValues.push({
                name: name,
                value: value,
            });
            boundaryFound = nameSet = gapFound = false;
            continue;
        }
    }
    return {
        "status": "success",
        "msg": "form parsed correctly",
        "value": 1,
        "form": FormValues
    };
};
exports.FormParser = FormParser;
