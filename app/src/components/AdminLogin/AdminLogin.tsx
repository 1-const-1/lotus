import React from "react";
import WelcomeMsg from "./WelcomeMsg/WelcomeMsg";
import Login from "./Login/Login";

const AdminLogin = () => {
  return (
    <div className="flex flex-row w-screen h-screen">
      <WelcomeMsg />
      <Login />
    </div>
  );
}

export default AdminLogin;