import React from "react"
import DefaultView from "../MenuViews/DefaultView";
import TradeView from "../MenuViews/TradeView";

interface SubMenu {
  id: number,
  name : string,
  view: JSX.Element,
}

/**
 * The list of all available submenus
 */
export const navMenu : Array<SubMenu> = [
  { 
    id: 0, 
    name: "Default", 
    view: <DefaultView />,
  },
  {
    id: 1, 
    name: "Trade", 
    view: <TradeView />,
  },
];