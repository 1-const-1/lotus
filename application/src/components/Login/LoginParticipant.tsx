import React from "react";
import WelcomeMsg from "./WelcomeMsg/WelcomeMsg";
import Login from "./Login/Login";
import { updateJsonToken } from "../app/EventCallbacks/updateClientToken";

const LoginParticipant = () => {
  return (
    <div className="flex flex-row w-screen h-screen">
      <WelcomeMsg />
      <Login />
    </div>
  );
}

export default LoginParticipant;