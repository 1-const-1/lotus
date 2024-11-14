import bcrypt from "bcrypt";
import { mongoClient } from "../../mongo";
import {v4 as uuidv4} from "uuid";

export const createAccount = async (data : {user_id: string, login: string, pass: string}) => {
  const db = mongoClient.db("lotus");
  const colUsers = db.collection("users");

  if (await colUsers.findOne({login: data.login})) {
    return {
      status: "error",
      msg: "the existing user",
      value: 0,
    };
  } else {

    const salt = bcrypt.genSaltSync(5);
    const bhash = bcrypt.hashSync(data.pass, salt);
    await colUsers.insertOne({user_id: data.user_id, login: data.login, pass: bhash, first_sign: true});

    return {
      status: "success",
      msg: "new account is created",
      value: 1,
    };
  }
}