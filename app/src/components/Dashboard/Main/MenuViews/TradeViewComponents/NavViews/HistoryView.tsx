import React, { ReactDOM, useEffect, useRef, useState} from "react";
import { getTradeRoomHistory } from "./HistoryViewContent/EventCallbacks/getTradeRoomHistory";
import {RxCross2} from "react-icons/rx";


const HistoryView = () => {

  const [mounted, setMounted] = useState(false);

  let roomsList : React.MutableRefObject<{
    [key:string] :string|number|boolean,
  }[]> = useRef([]);

  const thCol = [
    "Room name",
    "Max users",
    "Status",
    "Edit"
  ]

  useEffect(()=> {
    fetch("/trade/history/get", {
      method: "POST"
    })
      .then(res=> res.ok ? res.json(): console.error)
      .then(data=> {
        roomsList.current = data;
        setMounted(true);
      })
      .catch(err=>console.log(err));
  },[]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {thCol.map((val, idx)=> {
              return <th key={idx}>{val}</th>
            })}
          </tr>
        </thead>
        <tbody>
        {!mounted ? <tr><td>Still loading...</td></tr> :
          roomsList.current.map((val, idx)=> {
            return (
              <tr id={`room-${idx}`} key={idx}>
                <td>
                  <a href={`/trade/room?id=${btoa(val.room_id.toString())}`}>{val.room_name}</a>
                </td>
                <td>{val.users_q}</td>
                <td>{val.status ? "online" : "offline"}</td>
                <td>
                  <button>
                    <RxCross2 />
                  </button>
                </td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
    </div>
  );
}

export default HistoryView;