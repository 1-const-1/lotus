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
exports.createAccount = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongo_1 = require("../../mongo");
const createAccount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const db = mongo_1.mongoClient.db("lotus");
    const colUsers = db.collection("users");
    if (yield colUsers.findOne({ login: data.login })) {
        return {
            status: "error",
            msg: "the existing user",
            value: 0,
        };
    }
    else {
        const salt = bcrypt_1.default.genSaltSync(5);
        const bhash = bcrypt_1.default.hashSync(data.pass, salt);
        yield colUsers.insertOne({ user_id: data.user_id, login: data.login, pass: bhash, first_sign: true });
        return {
            status: "success",
            msg: "new account is created",
            value: 1,
        };
    }
});
exports.createAccount = createAccount;
