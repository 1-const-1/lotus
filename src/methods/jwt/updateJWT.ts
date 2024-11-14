import {parse} from "cookie";
import { JsonToken } from "./jsonToken";

export const updateJWT = (cookie: string) => {
  let result;
  let newJWT : JsonToken|null = null; 

  if (!cookie) {
    return {
      status: "error",
      msg: "cookie data is empty",
      newJwt: newJWT,
      value: 0,
    }
  }

  const c = parse(cookie);

  if (!c.JWT_TOKEN) {
    return {
      status: "error",
      msg: "cookie does not have JWT",
      newJwt: newJWT,
      value: 0,
    }
  }

  const jwtP = JsonToken.getPayload(c.JWT_TOKEN);

  if (jwtP.exp < Date.now()) {
    const jwtH = JsonToken.getHeader(c.JWT_TOKEN);
    const jwtS = JsonToken.getSecret(c.JWT_TOKEN);

    newJWT = new JsonToken();

    const p = {
      user_id: jwtP.user_id,
      login: jwtP.login,
      refresh_token : jwtP.refresh_token,
    }

    result = newJWT.generate(jwtH.alg, p, jwtS);
  } 

  return !result ? {
    status: "success",
    msg: "JWT is valid",
    newJwt: newJWT,
    value: 1,
  } : {
    status: "success",
    msg: "JWT was updated and it is valid now",
    newJwt: newJWT,
    value: 2,
  } 

}