"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
class JsonToken {
    constructor() {
        this.header = null;
        this.payload = null;
        this.secret = null;
        this.sHash = null;
    }
    generate(alg, payload, secret = "") {
        this.header = this.generateHeader(alg);
        if (!this.header) {
            return {
                status: "error",
                msg: "cannot generate token because the header is invalid",
                value: 0,
            };
        }
        this.payload = this.generatePayload(payload);
        if (!this.payload) {
            return {
                status: "error",
                msg: "cannot generate token because the payload is invalid",
                value: 0,
            };
        }
        this.secret = secret;
        this.sHash = this.generateSecret(this.header.alg, this.secret);
        return {
            status: "success",
            msg: "JWT token generated successfully",
            value: 1,
        };
    }
    generateHeader(alg) {
        if (!alg)
            return null;
        return {
            alg: alg,
            typ: "jwt",
        };
    }
    generatePayload(payload) {
        if (Object.keys(payload).length < 1) {
            return null;
        }
        payload["iat"] = Date.now();
        payload["exp"] = payload.iat + (1000 * 60 * 15);
        return payload;
    }
    generateSecret(alg, secret) {
        let hSecret = "";
        const hash = crypto_1.default.createHash(alg);
        hSecret = hash.update(secret).digest("hex");
        return hSecret;
    }
    info() {
        return {
            header: this.header,
            payload: this.payload,
            secret: this.secret,
            sHash: this.sHash,
            jwt: btoa(JSON.stringify(this.header ? this.header : "")) + "." + btoa(JSON.stringify(this.payload ? this.payload : "")) + "." + btoa(this.sHash ? this.sHash : ""),
        };
    }
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
exports.JsonToken = JsonToken;
