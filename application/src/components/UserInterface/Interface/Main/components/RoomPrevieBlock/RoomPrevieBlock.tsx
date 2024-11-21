import React from "react";

const RoomPrevieBlock = (props: {roomData :any}) => {
  return (
    <div className="border-2">
      <header>
        <h1>{props.roomData.room_name}</h1>
      </header>
      <main>
        <div>
        <h1>Max trade participants</h1>
        <p>{props.roomData.users_q}</p>
        </div>
        <div>
        <h1>Description</h1>
        <p>{props.roomData.description}</p>
        </div>
      </main>
      <footer>
        <a href={`/trade/room?id=${btoa(props.roomData.room_id)}`}>Connect</a>
      </footer>
    </div>
  );
}

export default RoomPrevieBlock;