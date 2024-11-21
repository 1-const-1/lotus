export class JWT {
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