import React from "react";
import ReactDOM from "react-dom/client";

import {RxCross2} from "react-icons/rx";

const PeculiarityComponent = (props: {
  cid: string, 
  inpName: string, 
  pecListId: string, 
  lPecRoot: React.MutableRefObject<ReactDOM.Root|null>,
  lPec: React.MutableRefObject<Array<JSX.Element>>}) => {

  return (
    <div id={props.cid}
          className="">
      <input 
        className="border"
        type="text" 
        name={props.inpName} />

      <button onClick={() => {
        const parent = document.getElementById(props.pecListId);
        const children = parent?.childNodes;
        
        if (children?.length) {
          for (let i = 0; i < children?.length; i++) {
            const elm = children[i] as HTMLElement;
            if (elm.id === props.cid) {
              props.lPec.current.splice(i, 1);
              break;
            }
          }

          props.lPecRoot.current?.render(
            props.lPec.current.map((val) => {
              return val;
            })
          );
        }
      
      }}>
        <RxCross2 className="w-4 h-4 stroke-red-600" />
      </button>

    </div>
  );
}

export default PeculiarityComponent;