import { SimpleFormValue } from "../../../custom_packages/form-parser/form-parser";
import {v4 as uuidv4} from "uuid";

export const checkDataToCreateRoom = (form: SimpleFormValue[]) => {
  if (!form.length) {
    return {
      status: "error",
      msg: "form does not contain any element",
      data: null,
      value: 0,
    }
  }

  let modified : {[key:string]:string|number|boolean|[]} = {
    room_id: uuidv4(), 
    status: false,
    active_users: [],
  };

  for (let idx = 0; idx < form.length; idx++) {
    if (!form[idx].value) {
      return {
        status: "error",
        msg: "form value cannot be empty",
        data: null,
        value: 0,
      }
    }

    modified[form[idx].name] = form[idx].value;
  }

  return {
    status: "success",
    msg: "data prepared correctly",
    data: modified,
    value: 1,
  }
} 
