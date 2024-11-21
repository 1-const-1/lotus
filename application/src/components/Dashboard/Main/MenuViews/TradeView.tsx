import React, { useState } from "react";
import { TradeViewNav } from "./TradeViewComponents/NavigationMenu";
import io from "socket.io-client";

const TradeView = () => {

  const socket = io();
  socket.emit("msg", "Trade room emit.");
 
  const nav = TradeViewNav;
  const [viewId, setViewId] = useState(0);

  return (
    <div>
      <div>
        <nav>
          <ul>
            {nav.map((val)=> {
              return <li onClick={()=> {setViewId(val.id)}} key={val.id}>{val.name}</li>;
            })}
          </ul>
        </nav>
      </div>
      <div>{viewId ? nav[viewId-1].view : <p>Empty</p>}</div>
    </div>
  );
}

export default TradeView;