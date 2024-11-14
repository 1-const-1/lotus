import bcrypt from "bcrypt";
import { mongoClient } from "../../mongo";

export const checkCredential = async (data : {login: string|null, pass: string}) => {
  const db = mongoClient.db("lotus");
  const colUsers = db.collection("users");

  const user = await colUsers.findOne({login: data.login});

  if (!user) {
    return {
      status: "error",
      msg: "the user is unknown",
      value: 0,
    };
  }

  const result = bcrypt.compareSync(data.pass, user.pass);

  if (!result) {
    return {
      status: "error",
      msg: "access denied",
      value: 0,
    };
  }

  return {
    status: "success",
    msg: "access granted",
    value: 1,
  };

}