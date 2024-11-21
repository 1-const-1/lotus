import React from "react";
import { createNewAccount } from "./EventCallbacks/createNewAccount";

const CreateNew = (props: {formId:string}) => {
  return (
    <div>
      <h1>New account</h1>
      <div>
        <label htmlFor="signup">Login</label>
        <input type="text" name="login" id="signup" required/>
      </div>
      <div>
        <label htmlFor="pass_signup">Password</label>
        <input type="password" name="pass" id="pass_signup" required/>
      </div>
      <div>
        <label htmlFor="pass_rep">Repeat password</label>
        <input type="password" name="" id="pass_rep" required/>
      </div>
      <div>
        <button 
          type="submit"
          className="p-3 bg-sky-500 font-bold text-base text-center text-white"
          onClick={() => {
            const form = document.getElementById(props.formId) as HTMLFormElement;
            createNewAccount(form);
          }}
          >Create</button>
      </div>
    </div>
  );
}

export default CreateNew;

