import React, { useEffect } from "react";
import { enCompanyTypes } from "./CompanyTypes";
import { sendFirstSignForm } from "./EventCallbacks/sendFirstSignForm";
import { updateJsonToken } from "../../app/EventCallbacks/updateClientToken";
import { checkFirstSignForm } from "./EventCallbacks/checkFirstSignForm";

import "./style/FirstSignForm.css";

const FirstSignForm = () => {

  useEffect(()=> {
    updateJsonToken();
  },[]);

  useEffect(()=> {
    checkFirstSignForm();
  },[]);

  const formId = "participant-form";
  const cTypes = enCompanyTypes;

  return(
    <div className="first-sign-form">
      <form id={formId} onSubmit={(e)=> {e.preventDefault();}}>
        <div>
          <label htmlFor="company-type"></label>
          <select name="company_type" id="company-type">
            {cTypes.map((val, idx)=> {
              if (val.short !== "other")
                return <option key={idx} value={val.short}>{val.short} {val.full}</option>;
              else 
                return <option key={idx} value={val.short}>{val.full}</option>;
            })}
          </select>
        </div>
        <div>
          <label htmlFor="name">Organization name</label>
          <input type="text" name="company_name" id="name" />
        </div>
        <div>
          <button 
            type="submit"
            onClick={()=>{
              const f = document.getElementById(formId) as HTMLFormElement;
              sendFirstSignForm(f);
            }}>
            Save
          </button>
        </div>
        <p>
          You can change these parameteres in any time
        </p>
      </form>
    </div>
  );
}

export default FirstSignForm;