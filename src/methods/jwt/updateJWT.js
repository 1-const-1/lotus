"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJWT = void 0;
const cookie_1 = require("cookie");
const jsonToken_1 = require("./jsonToken");
const updateJWT = (cookie) => {
    let result;
    let newJWT = null;
    if (!cookie) {
        return {
            status: "error",
            msg: "cookie data is empty",
            newJwt: newJWT,
            value: 0,
        };
    }
    const c = (0, cookie_1.parse)(cookie);
    if (!c.JWT_TOKEN) {
        return {
            status: "error",
            msg: "cookie does not have JWT",
            newJwt: newJWT,
            value: 0,
        };
    }
    const jwtP = jsonToken_1.JsonToken.getPayload(c.JWT_TOKEN);
    if (jwtP.exp < Date.now()) {
        const jwtH = jsonToken_1.JsonToken.getHeader(c.JWT_TOKEN);
        const jwtS = jsonToken_1.JsonToken.getSecret(c.JWT_TOKEN);
        newJWT = new jsonToken_1.JsonToken();
        const p = {
            user_id: jwtP.user_id,
            login: jwtP.login,
            refresh_token: jwtP.refresh_token,
        };
        result = newJWT.generate(jwtH.alg, p, jwtS);
    }
    return !result ? {
        status: "success",
        msg: "JWT is valid",
        newJwt: newJWT,
        value: 1,
    } : {
        status: "success",
        msg: "JWT was updated and it is valid now",
        newJwt: newJWT,
        value: 2,
    };
};
exports.updateJWT = updateJWT;
