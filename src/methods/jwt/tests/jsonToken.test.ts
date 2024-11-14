import { JsonToken } from "../jsonToken";

test("Generate JWT", ()=> {
  const jwt = new JsonToken();
  const res = jwt.generate("sha512", {user:93213, login: "user@example.io"}, "TEST_SECRET");
  expect(res.value).toBe(1);
  console.log(jwt.info());
  console.log(res);
  console.log(JsonToken.getHeader(jwt.info().jwt), JsonToken.getPayload(jwt.info().jwt), JsonToken.getSecret(jwt.info().jwt))
});

test("Alg issue", ()=>{
  const jwt = new JsonToken();
  const res = jwt.generate("", {});
  expect(res.value).toBe(0);
  console.log(jwt.info());
  console.log(res);
});

test("Payload issue", ()=> {
  const jwt = new JsonToken();
  const res = jwt.generate("md5", {});
  expect(res.value).toBe(0);
  console.log(jwt.info());
  console.log(res);
});