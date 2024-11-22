import React from "react";
import WelcomeMsg from "./WelcomeMsg/WelcomeMsg";
import Login from "./Login/Login";
import "./style/LoginParticipant.css";

const LoginParticipant = () => {
  return (
    <div className="lf-container">
      <div>
        <WelcomeMsg />
        <Login />
      </div>
    </div>
  );
}

export default LoginParticipant;