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
const checkCredentials_1 = require("../checkCredentials");
const data = {
    login: "test_user",
    pass: "test_pass",
};
const data_1 = {
    login: "te",
    pass: "tes",
};
const data_2 = {
    login: "test_user",
    pass: "test_",
};
test("Check credentials (correct)", () => __awaiter(void 0, void 0, void 0, function* () {
    const res_1 = yield (0, checkCredentials_1.checkCredential)(data);
    expect(res_1.value).toBe(1);
    console.log(res_1);
}));
test("Check credentials (incorrect login)", () => __awaiter(void 0, void 0, void 0, function* () {
    const res_2 = yield (0, checkCredentials_1.checkCredential)(data_1);
    expect(res_2.value).toBe(0);
    console.log(res_2);
}));
test("Check credentials (incorrect password)", () => __awaiter(void 0, void 0, void 0, function* () {
    const res_3 = yield (0, checkCredentials_1.checkCredential)(data_2);
    expect(res_3.value).toBe(0);
    console.log(res_3);
}));
