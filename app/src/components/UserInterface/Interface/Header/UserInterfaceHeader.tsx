import React from "react";
import {MdAccountCircle} from "react-icons/md"
import "./style/UserInterfaceHeader.css";

const UserInterfaceHeader = () => {
  return (
    <header>
      <div className="ui-header">
        <div className="ln-container">
          <p>LOTUS</p>
        </div>
        <div>
          <MdAccountCircle className="w-7 h-7" />
        </div>
      </div>
    </header>
  );
}

export default UserInterfaceHeader;