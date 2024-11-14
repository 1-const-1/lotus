"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonToken_1 = require("../jsonToken");
test("Generate JWT", () => {
    const jwt = new jsonToken_1.JsonToken();
    const res = jwt.generate("sha512", { user: 93213, login: "user@example.io" }, "TEST_SECRET");
    expect(res.value).toBe(1);
    console.log(jwt.info());
    console.log(res);
    console.log(jsonToken_1.JsonToken.getHeader(jwt.info().jwt), jsonToken_1.JsonToken.getPayload(jwt.info().jwt), jsonToken_1.JsonToken.getSecret(jwt.info().jwt));
});
test("Alg issue", () => {
    const jwt = new jsonToken_1.JsonToken();
    const res = jwt.generate("", {});
    expect(res.value).toBe(0);
    console.log(jwt.info());
    console.log(res);
});
test("Payload issue", () => {
    const jwt = new jsonToken_1.JsonToken();
    const res = jwt.generate("md5", {});
    expect(res.value).toBe(0);
    console.log(jwt.info());
    console.log(res);
});
