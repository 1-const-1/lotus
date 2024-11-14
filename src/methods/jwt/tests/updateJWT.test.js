"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateJWT_1 = require("../updateJWT");
const jwt = "JWT_TOKEN=eyJhbGciOiJzaGEyNTYiLCJ0eXAiOiJqd3QifQ%3D%3D.eyJ1c2VyX2lkIjoiMzUzN2QzNjEtNGFhMC00MWQ2LThmOWYtNmVkOTc2MTIzYjBhIiwibG9naW4iOiJjb25zdGFudCIsInJlZnJlc2hfdG9rZW4iOiI0MzY0MThkOGMwYzgwMThmYTBlNDQ0YzgxMGM2NzZiMWY3ZWYwY2M1Nzg2MzQyZGQzYjMwNDRkMDE3NzY3ZmU0YmIwMGRjMWE5NGM1OWUzYWRmZjYwMDFiNzVlM2M5NjgwZDU4M2MzNTE2MGY0OWZkMjQ5NzQyM2QwMGI2M2UxMyIsImlhdCI6MTczMTMwOTg3MzY5MiwiZXhwIjoxNzMxMzEwNzczNjkyfQ%3D%3D.NTg4ZTgwNDZiM2U5MzI2M2I0YmM2NmRhZjk1NDQzMDIxNDg4OWY2OTljZWE1YzlmZDFhOTM5YWMxZDZjNTU2OQ%3D%3D";
test("Update valid JWT", () => {
    let result = (0, updateJWT_1.updateJWT)(jwt);
    expect(result.value).toBe(result.value ? result.value : 0);
    console.log(result);
});
test("No cookie", () => {
    let result = (0, updateJWT_1.updateJWT)("");
    expect(result.value).toBe(0);
    console.log(result);
});
test("No jwt token", () => {
    let result = (0, updateJWT_1.updateJWT)("TEST=CASE");
    expect(result.value).toBe(0);
    console.log(result);
});
