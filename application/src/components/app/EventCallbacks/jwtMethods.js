"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = void 0;
class JWT {
    static getHeader(jwt) {
        const base = jwt.split(".");
        return JSON.parse(atob(base[0]));
    }
    static getPayload(jwt) {
        const base = jwt.split(".");
        return JSON.parse(atob(base[1]));
    }
    static getSecret(jwt) {
        const base = jwt.split(".");
        return atob(base[2]);
    }
}
exports.JWT = JWT;
