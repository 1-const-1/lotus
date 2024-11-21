import React from "react";
import { Socket } from "socket.io-client";
import ClientForm from "../ClientForm/ClientForm";

const ClientMenu = (
  props:{
    rData:any, 
    ufBool: boolean, 
    ufSetter:any,
    room_id: string|null,
    user_id: string|null,
    socket: Socket,
    activeUser: number,
    user_index: number,
    active_session: boolean,
  }
) => {
  let btn :React.MutableRefObject<HTMLButtonElement|null> = React.useRef(null);

  return (
  <div>
    <div>
      <button
        onClick={(e)=> {
          btn.current = e.target as HTMLButtonElement;
          props.ufSetter(!props.ufBool);
        }}>Join</button>
      <button 
        onClick={(e)=> {
          e.preventDefault();

          if (btn.current)
            btn.current.disabled = false;

          fetch("/trade/room/user/leave", {
            method: "POST",
            body: JSON.stringify({
              room_id: props.room_id,
              user_id: props.user_id,
            })
          })
            .then(res=> {
              if (res.redirected) {
                console.log(`You have just left, id: ${props.user_id}`);
                
                if (props.room_id && props.user_id) {
                  props.socket.emit("user_make_move_req", {room_id: props.room_id!, user_id: props.user_id!}, props.activeUser, props.socket.id);
                  props.socket.emit("trade_room_timer_start", {room_id: props.room_id}, 10, props.socket.id);
                  props.socket.emit("user_leaves_req", {room_id: props.room_id, user_id: props.user_id});
                }

              } else {
                console.log("Response is not OK!");
              }
            })
            .catch(err=> console.log(err));

        }}>Leave</button>
      <button onClick={()=> {
          props.socket.emit("user_make_move_req", {room_id: props.room_id!, user_id: props.user_id!}, props.activeUser, props.socket.id);
          props.socket.emit("trade_room_timer_start", {room_id: props.room_id}, 10, props.socket.id);
      }} disabled={props.active_session && (props.activeUser === props.user_index) ? false : true}>Move</button>
    </div>
    <div>
      {props.ufBool 
      ? <ClientForm 
          room_id={props.room_id} 
          user_id={props.user_id} 
          rData={props.rData} 
          socket={props.socket} 
          joinBtn={btn.current}
          /> 
      : <></> }
    </div>
  </div>
  );
}

export default ClientMenu;