import React from "react";
import UserInterfaceHeader from "./Header/UserInterfaceHeader";
import UserInterfaceMain from "./Main/UserInterfaceMain";

const UserInterface = () => {
  return(
    <div>
      <UserInterfaceHeader />
      <UserInterfaceMain />
    </div>
  );
}

export default UserInterface;