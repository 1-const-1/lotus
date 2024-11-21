import React from "react";

const ChangeFormBtn = (
  props: {
    rOnly:boolean,
    rOnlySetter: any,
  }
) => {
  return (
    <div>
      <button onClick={()=> {
        props.rOnlySetter(!props.rOnly);
      }}>Change</button>
    </div>
  )
}

export default ChangeFormBtn;