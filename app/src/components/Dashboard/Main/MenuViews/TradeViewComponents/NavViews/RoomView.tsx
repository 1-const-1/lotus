import React, { useState } from "react";
import RoomViewContent from "./RoomViewContent/RoomViewContent";

const RoomView = () => {

  const [clicked, setClicked] = useState(0);

  return (
    <div>
      <div className="flex flex-row w-full">
        <button 
          onClick={() => {setClicked(1);}} 
          className="p-3 bg-sky-500 font-bold text-base text-center text-white">Create room</button>
      </div>
      <div>
        {clicked ? <RoomViewContent /> : <></>}
      </div>
    </div>
  );
}

export default RoomView;