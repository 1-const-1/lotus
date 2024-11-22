import React from "react";
import { Socket } from "socket.io-client";

const joinToRoom = (socket:Socket, room: string|null, userId: string|null) => {
  socket.emit("room_join_req", {room_id: room, user_id: userId});
}

const ClientForm = (
  props:{
    room_id:string|null, 
    user_id:string|null, 
    rData:any, 
    socket:Socket, 
    joinBtn: HTMLButtonElement|null,
    ufSetter: any,
  }
  ) => {
  const fid = "_form_3";
  let roomData = [];
  const btn = props.joinBtn;

  const [subClicked, setSubClicked] = React.useState(false);

  for (let key in props.rData) {
    roomData.push([key, props.rData[key]]);
  }

  return (
    <div className="client-form">
      {
        !subClicked 
        ? (<form id={fid} onSubmit={e => e.preventDefault()}>
          <header>The form of participant</header>
        {roomData.map((val, idx)=> {
          if (![
            "product_name",
            "description",
            "status",
            "room_id",
            "room_name",
            "users_q",
            "_id",
            "active_users",
            "move_idx",
            "active_session",
          ].find(v => v === val[0])) {
            return (
              <div key={idx}>
                <p>{val[0]}</p>
                <input name={val[0]} type="text" />
              </div>
            );
          }
         })
        }
        <div>
          <button 
            onClick={()=> {
              const f = new FormData(document.getElementById(fid) as HTMLFormElement);
              f.append("room_id", props.room_id!);
              f.append("user_id", props.user_id!);

              fetch("/trade/room/user/new", {
                method: "POST",
                body: f,
              })
                .then(res=> {
                  if (res.ok) {
                    console.log("Response is OK");
                    return res.text();
                  } else {
                    console.log("Response is not OK");
                  }
                })
                .then(()=> {
                  joinToRoom(props.socket, props.room_id, props.user_id);
                  if (btn)
                    btn.disabled = true;

                  setSubClicked(true);
                })
                .catch(err=> console.log(err));
            }}
            >Submit</button>
          <button
            onClick={()=> {
              props.ufSetter(false);
            }}>Close</button>
        </div>
      </form>)
      : <div></div>
      }
      
    </div>
  );
}

export default ClientForm;