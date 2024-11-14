import { checkCredential } from "../checkCredentials";

const data = {
  login: "test_user",
  pass: "test_pass",
}

const data_1 = {
  login: "te",
  pass: "tes",
}

const data_2 = {
  login: "test_user",
  pass: "test_",
}

test("Check credentials (correct)", async ()=> {
  const res_1 = await checkCredential(data);
  expect(res_1.value).toBe(1);
  console.log(res_1);
});

test("Check credentials (incorrect login)", async () => {
  const res_2 = await checkCredential(data_1);
  expect(res_2.value).toBe(0);
  console.log(res_2);
});

test("Check credentials (incorrect password)", async () => {
  const res_3 = await checkCredential(data_2);
  expect(res_3.value).toBe(0);
  console.log(res_3);
});

