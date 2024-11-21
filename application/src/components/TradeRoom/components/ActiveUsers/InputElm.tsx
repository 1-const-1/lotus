import React from "react";

const InputElm = (props:{label:any, value:any, ro:any}) => {
  const [inpValue, setInpValue] = React.useState(props.value);
  
  return (
  <div>
    <label htmlFor="">{props.label}</label>
    <input 
      name={props.label} 
      value={inpValue} 
      onChange={(e)=> {
        setInpValue(e.target.value);
      }} 
      type="text" 
      readOnly={props.ro}/>
  </div>
  );
}

export default InputElm;