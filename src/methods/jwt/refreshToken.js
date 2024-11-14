"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const uuid_1 = require("uuid");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class RefreshToken {
    constructor() {
        this.id = "";
        this.user_id = "";
        this.token = "";
        this.bhash = "";
    }
    generate(user_id) {
        if (!user_id) {
            return {
                status: "error",
                msg: "refresh token was not generated because 'user_id' was not set",
                value: 0,
            };
        }
        this.id = (0, uuid_1.v4)();
        this.user_id = user_id;
        this.token = crypto_1.default.randomFillSync(Buffer.alloc(64)).toString("hex");
        if (this.token) {
            const salt = bcrypt_1.default.genSaltSync(5);
            this.bhash = bcrypt_1.default.hashSync(this.token, salt);
            return {
                status: "success",
                msg: "refresh token was generated successfully",
                value: 1,
            };
        }
        else {
            return {
                status: "error",
                msg: "refresh token was not generated",
                value: 0,
            };
        }
    }
    info() {
        return {
            id: this.id,
            user_id: this.user_id,
            token: this.token,
            bhash: this.bhash,
        };
    }
}
exports.RefreshToken = RefreshToken;
