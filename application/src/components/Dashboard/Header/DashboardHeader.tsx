import React, { useRef, useState } from "react";
import {IoMenuOutline} from "react-icons/io5";
import {IoIosLogOut} from "react-icons/io";

/**
 * This is the header of the dashboard component
 * @returns 
 */
const DashboardHeader = () => {

  let menuClicked = useRef(false);

  return (
    <header>
      <div className="py-4 bg-sky-500 text-white flex flex-row justify-evenly align-middle">
        <div>
          <button 
            className="flex items-center"
            onClick={()=> {
              const menu = document.getElementById("dash-menu");
              
              menuClicked.current = !menuClicked.current;

              if (menu) {
                if (menuClicked) {
                  menu.style.width = 128 + "px";
                } else {
                  menu.style.width = 0 + "px";
                }
              }
            }}
            >
            <IoMenuOutline className="w-8 h-8"/>
          </button>
        </div>
        <div className="font-bold text-2xl w-9/12 text-center">
          Dashboard
        </div>
        <div>
          <button className="flex items-center">
            <IoIosLogOut className="w-8 h-8" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;