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
Object.defineProperty(exports, "__esModule", { value: true });
const createAccount_1 = require("../createAccount");
const data = {
    user_id: "12345678900987654321",
    login: "test_user",
    pass: "test_pass",
};
test("Create a new account", () => __awaiter(void 0, void 0, void 0, function* () {
    const res_1 = yield (0, createAccount_1.createAccount)(data);
    expect(res_1.value).toBe(1);
}));
test("Check existin account", () => {
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const res_2 = yield (0, createAccount_1.createAccount)(data);
        expect(res_2.value).toBe(0);
    }), 1000 * 10);
});
