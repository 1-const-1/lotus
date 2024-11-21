import React, { useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import PeculiarityComponent from "./PeculiarityComponent/PeculiarityComonent";
import { createRoom } from "./EventCallbacks/createRoom";

/**
 * This components return a view of one of submenus
 * of the parent menu (Trade) in Dashboard menu
 * @returns 
 */
const RoomViewContent = () : JSX.Element  => {

  /**
   * The identifier for the form to create a new room
   */
  const formId = "_room_form";

  /**
   * The identifirer for a list element (div)
   * with peculiarities of a product or service
   */
  const pecListId = "_pec_list";

  /**
   * This array stores a list of peculiarties
   */
  const lPec : React.MutableRefObject<Array<JSX.Element>> = useRef([]);

  /**
   * This hook helps to set and complete keys, names, id of HTML elements 
   * These HTML element are TSX components to describe peculiarities of
   * a product / service
   */
  const [pid, setPid] = useState(1);

  /**
   * A list element where all new peculiarities will be rendered
   */
  let lPecRoot : React.MutableRefObject<ReactDOM.Root|null> = useRef(null);

  return (
    <div>
      <form id={formId} onSubmit={(e) => {e.preventDefault();}}>

        <div>
          <label htmlFor="inp_1">Room name</label>
          <input 
          className="border"
          type="text" name="room_name" id="inp_1"/>
        </div>

        <div>
          <label htmlFor="inp_2"></label>
          <input
          className="border"
          type="number" name="users_q" id="inp_2"/>
        </div>

        <div>
          <label htmlFor="inp_3">Produc/Service name</label>
          <input
          className="border"
          type="text" name="product_name" id="inp_3"/>
        </div>

        <div>
          <label htmlFor="inp_4">Price</label>
          <input
          className="border"
          type="text" name="price" id="inp_4"/>
        </div>

        <div>
          <label htmlFor="inp_5">Description</label>
          <textarea name="description" id="inp_5"></textarea>
        </div>

        <div>

          <div>
            <p>Product peculiarities</p>
          </div>

          <div>

            <button 
              className="p-3 bg-sky-500 font-bold text-base text-center text-white"
              onClick={() => {
              if (!lPecRoot.current) {
                lPecRoot.current = ReactDOM.createRoot(document.getElementById(pecListId)!);
              } 

              const cid = `_c_pec_${pid}`;
              const inpName = `pec_${pid}`;

              lPec.current.push(<PeculiarityComponent 
                key={cid}
                cid={cid} 
                inpName={inpName} 
                pecListId={pecListId} 
                lPecRoot={lPecRoot} 
                lPec={lPec} />);

              lPecRoot.current.render(
                lPec.current.map((val) => {
                  return val;
                })
              );
            
              const newId = pid + 1;
              setPid(newId);

            }}>Add</button>

          </div>
          <div id={pecListId}></div>
        </div> 

        <div>
          <button 
            className="p-3 bg-sky-500 font-bold text-base text-center text-white"
            onClick={()=>{
              const form = document.getElementById(formId) as HTMLFormElement;
              createRoom(form);
            }}
            >
              Create
            </button>
        </div>

      </form>
    </div>
  );
}

export default RoomViewContent;