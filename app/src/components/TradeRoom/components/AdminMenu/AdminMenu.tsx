import React from "react";
import { Socket } from "socket.io-client";

const AdminMenu = (
  props : {
    room_id: string|null,
    socket: Socket,
    active_session: boolean,
  }
) => {
  return (
    <div>
      <button
        onClick={(()=> {
          props.socket.emit("trade_room_session_start_req", {room_id:props.room_id});
          props.socket.emit("trade_room_timer_start", {room_id: props.room_id}, 10, props.socket.id);
        })}
        disabled={!props.active_session ? false : true}>START TRADES</button>
      <button
        onClick={()=> {
          props.socket.emit("trade_room_session_end_req", {room_id: props.room_id});
          props.socket.emit("trade_room_timer_start", {room_id: props.room_id}, 10, props.socket.id, true);
        }}
        disabled={props.active_session ? false : true}>STOP TRADES</button>
    </div>
  );
}

export default AdminMenu;