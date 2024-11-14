import { createAccount } from "../createAccount";

const data = {
  user_id: "12345678900987654321",
  login: "test_user",
  pass: "test_pass",
}

test("Create a new account", async ()=> {
  const res_1 = await createAccount(data);
  expect(res_1.value).toBe(1);
});

test("Check existin account", () => {

  setTimeout(async ()=> {
    const res_2 = await createAccount(data);
    expect(res_2.value).toBe(0);
  }, 1000 * 10);

});

