import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import InputElm from "./InputElm";
import ChangeFormBtn from "./ChangeFormBtn";
import SaveChangesBtn from "./SaveChagesBtn";
import DivElm from "./DivElm";

const ActiveForms = (
  props: {
    move_idx: number,
    userOfferInfo: any,
    room_id: any,
    user_id: any,
    socket: Socket,
    idx: number,
    timer: number,
    userInfo: any,
  }
) => {
  let arrElm = [] as JSX.Element[];

  const [fid, setFid] = React.useState(`user_form_${props.userOfferInfo.user_id}`);
  const [tid, setTid] = React.useState(`user_timer_${props.userOfferInfo.user_id}`);
  const [offerInfo, setOfferInfo] = React.useState(props.userOfferInfo);
  const [rOnly, setReadOnly] = React.useState(true);

  arrElm.push(
      <div className="flex flex-row">
        <div>{props.userInfo.company_type} {props.userInfo.company_name}</div>
      </div>
  );

  for (let key in offerInfo.offer) {
    if (offerInfo.user_id === props.user_id) {
      arrElm.push(
        <InputElm
          key={key}
          label={key}
          value={offerInfo.offer[key]}
          ro={rOnly} />);
    } else {
      arrElm.push(
        <DivElm 
          key={key}
          label={key}
          value={offerInfo.offer[key]}/>
      )
    }

    }

    if (offerInfo.user_id === props.user_id) {
      arrElm.push(
        <ChangeFormBtn
          rOnly={rOnly}
          rOnlySetter={setReadOnly} />
      )

      arrElm.push(
        <SaveChangesBtn 
          fid={fid}
          room_id={props.room_id}
          user_id={props.user_id}
          idx={props.idx}
          socket={props.socket}/>
      )
    }

  return (
    <div className="user-offer-form">
      <div id={tid}>{props.move_idx === props.idx ? `00:${props.timer}` : "Wait..."}</div>
      <form 
        id={fid}
        onSubmit={e=> e.preventDefault()}>
        {arrElm
          ? arrElm.map((val, idx)=> {
              return <div key={idx}>{val}</div>;
            })
          : <p>Loading data...</p>}
      </form>
    </div>
  );
}

export default ActiveForms;