import crypto from "crypto";

export class JsonToken {
  protected header : null|{alg:string, typ:string} = null;
  protected payload : null|{[key:string]:string|number} = null;
  protected secret : null|string = null;
  protected sHash : null|string = null;

  constructor () {}

  public generate (
    alg:string, 
    payload: {[key:string] : string|number}, 
    secret: string = "") {
      this.header = this.generateHeader(alg);
      if (!this.header) {
        return {
          status: "error",
          msg: "cannot generate token because the header is invalid",
          value: 0,
        }
      }

      this.payload = this.generatePayload(payload);
      if (!this.payload) {
        return {
          status: "error",
          msg: "cannot generate token because the payload is invalid",
          value: 0,
        }
      }

      this.secret = secret;
      this.sHash = this.generateSecret(this.header.alg, this.secret);
    
      return {
        status: "success",
        msg: "JWT token generated successfully",
        value: 1,
      }
  }

  private generateHeader (alg:string) {
    if (!alg) return null;
    return {
      alg: alg,
      typ: "jwt",
    };
  }

  private generatePayload (payload : {[key:string] :string|number}) {
    if (Object.keys(payload).length < 1) {
      return null;
    }

    payload["iat"] = Date.now();
    payload["exp"] = payload.iat + (1000 * 60 * 15); 

    return payload;
  }

  private generateSecret (alg:string, secret:string) {
    let hSecret :null|string = "";
    const hash = crypto.createHash(alg);
    hSecret = hash.update(secret).digest("hex");
    return hSecret;
  }

  public info () {
    return {
      header: this.header,
      payload: this.payload,
      secret: this.secret,
      sHash: this.sHash,
      jwt: btoa(JSON.stringify(this.header ? this.header : "")) + "." + btoa(JSON.stringify(this.payload ? this.payload : "")) + "." + btoa(this.sHash ? this.sHash : ""),
    }
  }

  public static getHeader (jwt: string) {
    const base = jwt.split(".");
    return JSON.parse(atob(base[0]));
  }

  public static getPayload (jwt: string) {
    const base = jwt.split(".");
    return JSON.parse(atob(base[1]));
  }

  public static getSecret (jwt: string) {
    const base = jwt.split(".");
    return atob(base[2]);
  }

}