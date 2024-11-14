import {v4 as uuidv4} from "uuid";
import crypto from "crypto";
import bcrypt from "bcrypt";

export class RefreshToken {
  protected id = "";
  protected user_id = "";
  protected token = "";
  protected bhash = "";

  constructor () {}

  public generate(user_id : string) {
    if (!user_id) {
      return {
        status : "error",
        msg: "refresh token was not generated because 'user_id' was not set",
        value: 0,
      };
    }

    this.id = uuidv4();
    this.user_id = user_id;
    this.token = crypto.randomFillSync(Buffer.alloc(64)).toString("hex");

    if (this.token) {

      const salt = bcrypt.genSaltSync(5);
      this.bhash = bcrypt.hashSync(this.token, salt);
      return {
        status : "success",
        msg: "refresh token was generated successfully",
        value: 1,
      };

    } else {

      return {
        status : "error",
        msg: "refresh token was not generated",
        value: 0,
      };

    }
  }

  public info () {
    return {
      id: this.id,
      user_id: this.user_id,
      token: this.token,
      bhash: this.bhash,
    };
  }
}