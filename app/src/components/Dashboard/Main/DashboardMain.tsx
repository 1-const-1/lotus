import React, { useState } from "react";
import { navMenu } from "./ListMenu/NavMenu";

import "./style/style.css"

/**
 * This is the main component of the dashboard
 * (main semantic element in HTML body)
 * @returns 
 */
const DashboardMain = () => {
  
  /**
   * List of submenus
   */
  const nav = navMenu;

  const [sb, setSubmenu] = useState(0);

  return(
    <main className="h-full">
      <div className="h-full flex flex-row items-start">
        <div id="dash-menu">
          <ul className="menu-list">
            {nav.length ? nav.map((val, idx) => {
              if (idx !== 0) {
                return (
                  <li className="list-elm py-4 indent-3 text-base"
                      onClick={()=> {setSubmenu(val.id)}}
                      key={val.id}>
                      <span>{val.name}</span>
                    </li>
                );
              }
            }) : "Empty"}
          </ul>
        </div>
        <div>
          {nav[sb].view}
        </div>
      </div>
    </main>
  );
}

export default DashboardMain;