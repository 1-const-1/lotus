import React, { useEffect } from "react";
import DashboardHeader from "./Header/DashboardHeader";
import DashboardMain from "./Main/DashboardMain";
import { updateAdminJsonToken } from "../app/EventCallbacks/updateClientToken";

/**
 * Admin dashboard component
 * @returns 
 */
const Dashboard = () => {

  useEffect(()=> {
    updateAdminJsonToken();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader/>
      <DashboardMain />
    </div>
  );
}

export default Dashboard;