"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const refreshToken_1 = require("../refreshToken");
const uuid_1 = require("uuid");
test("Generate Refresh token", () => {
    const rToken = new refreshToken_1.RefreshToken();
    const res = rToken.generate((0, uuid_1.v4)());
    console.log(rToken.info());
    expect(res === null || res === void 0 ? void 0 : res.value).toBe(1);
});
