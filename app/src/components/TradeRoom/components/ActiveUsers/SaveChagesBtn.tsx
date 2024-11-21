import React from "react";
import { Socket } from "socket.io-client";

const userChangesOffer = (socket:Socket, data:{room_id:string|null, user_id:string|null}) => {
  socket.emit("user_changes_offer_req", data);
}

const fetchChanges = (fid: string, socket:Socket, data:{room_id:string|null, user_id:string|null, idx:string|number|null}) => {
  const f =  new FormData(document.getElementById(fid) as HTMLFormElement);
  f.append("room_id", data.room_id!);
  f.append("user_id", data.user_id!);
  f.append("index", `${data.idx}`);

  fetch("/trade/room/user/form_updated", {
    method: "POST",
    body: f,
  })
    .then(res=> {
      if (res.ok) {
        console.log("Response is OK!");
        userChangesOffer(socket, {room_id: data.room_id, user_id: data.user_id});
      } else {
        console.log("Response is not OK!");
      }
    })
    .catch(err=> console.log(err));
}

const SaveChangesBtn = (
  props: {
    fid:string,
    socket: Socket,
    room_id: string|null,
    user_id: string|null,
    idx: string|number|null,
  }
) => {

  return(
    <div>
      <button 
        onClick={
          ()=>{
            fetchChanges(props.fid, props.socket, {room_id: props.room_id, user_id: props.user_id, idx: props.idx});
          }
          }>Save</button>
    </div>
  )
  

}

export default SaveChangesBtn;