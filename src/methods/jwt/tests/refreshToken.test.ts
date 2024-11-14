import { RefreshToken } from "../refreshToken";
import {v4 as uuidv4} from "uuid";

test("Generate Refresh token", () => {
  const rToken = new RefreshToken();
  const res = rToken.generate(uuidv4());
  console.log(rToken.info());
  expect(res?.value).toBe(1);
});