import React from "react";
import { loginExistingAccount } from "./EventCallbacks/loginExistingAccount";

const AccountExists = (props: {formId:string}) => {
  return (
    <div>
      <h1>Account</h1>
      <div>
        <label htmlFor="login">Login</label>
        <input type="text" name="login" id="login" required/>
      </div>
      <div>
        <label htmlFor="pass_login">Password</label>
        <input type="password" name="pass" id="pass_login" required/>
      </div>
      <div>
        <button 
          type="submit"
          className="p-3 bg-sky-500 font-bold text-base text-center text-white"
          onClick={() => {
            const form = document.getElementById(props.formId) as HTMLFormElement;
            loginExistingAccount(form);
          }}
          >Enter</button>
      </div>
    </div>
  );
}

export default AccountExists;

