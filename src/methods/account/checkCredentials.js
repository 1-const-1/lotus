"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCredential = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongo_1 = require("../../mongo");
const checkCredential = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const db = mongo_1.mongoClient.db("lotus");
    const colUsers = db.collection("users");
    const user = yield colUsers.findOne({ login: data.login });
    if (!user) {
        return {
            status: "error",
            msg: "the user is unknown",
            value: 0,
        };
    }
    const result = bcrypt_1.default.compareSync(data.pass, user.pass);
    if (!result) {
        return {
            status: "error",
            msg: "access denied",
            value: 0,
        };
    }
    return {
        status: "success",
        msg: "access granted",
        value: 1,
    };
});
exports.checkCredential = checkCredential;
