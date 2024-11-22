import React from "react";
import WelcomeMsg from "./WelcomeMsg/WelcomeMsg";
import Login from "./Login/Login";
import "./style/AdminLogin.css"

const AdminLogin = () => {
  return (
    <div className="lf-container">
      <div>
        <WelcomeMsg />
        <Login />
      </div>
    </div>
  );
}

export default AdminLogin;