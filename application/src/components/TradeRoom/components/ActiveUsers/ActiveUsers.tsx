import React from "react";
import { Socket } from "socket.io-client";
import ActiveForms from "./ActiveForms";

const ActiveUsers = (
  props:{
    rInfo: any,
    room_id:string|null, 
    user_id: string|null,
    socket: Socket,
    timer: number,
  }
) => {

  return(
    <div>
    {props.rInfo.active_users
      ? props.rInfo.active_users.map((val:any, idx:any)=> {
        return(
          <ActiveForms
            move_idx={props.rInfo.move_idx}
            key={idx}
            userOfferInfo={val}
            room_id={props.room_id}
            user_id={props.user_id}
            socket={props.socket}
            idx={idx}
            timer={props.timer}
            />
        );
      })
      : "none..."}
    </div>
  );
}

export default ActiveUsers;