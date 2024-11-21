import "./style/App.css"

import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginParticipant from "../Login/LoginParticipant";
import UserInterface from "../UserInterface/Interface/UserInterface";
import FirstSignForm from "../UserInterface/FirstSignForm/FirstSignForm";
import Dashboard from "../Dashboard/Dashboard";
import TradeRoom from "../TradeRoom/TradeRoom";
import AdminLogin from "../AdminLogin/AdminLogin";

const App = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <Routes>
        <Route path="/account" element={<LoginParticipant />}></Route>
        <Route path="/participant/form" element={<FirstSignForm />}></Route>
        <Route path="/participant" element={<UserInterface />}></Route>
        <Route path="/a/dashboard" element={<Dashboard />}></Route>
        <Route path="/a" element={<AdminLogin />}></Route>
        <Route path="/trade/room" element={<TradeRoom/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;