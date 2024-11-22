import React from "react";

const DivElm = (props:{label:any, value:any}) => {
  const [inpValue, setInpValue] = React.useState(props.value);
  
  return (
  <div>
    <label>{props.label}</label>
    <div>{inpValue}</div>
  </div>
  );
}

export default DivElm;