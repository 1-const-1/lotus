import React from "react";

const ProductBlock = (props: {rInfo: any}) => {
  if (!props.rInfo) {
    return <div>No data...</div>;
  }

  let roomData = [];

  for (let key in props.rInfo) {
    roomData.push([key, props.rInfo[key]]);
  }

  return (
    <div className="product-block">
      {props.rInfo 
        ? roomData.map((val, idx)=> {
          if (val[0] === "product_name") {
            return (
              <div key={idx}>
                <h1>Product</h1>
                <p>{val[1]}</p>
              </div>
            );
          } else if (val[0] === "description") {
            return (
              <div key={idx}>
                <h1>Description</h1>
                <p>{val[1]}</p>
                <h1>Peculiarities</h1>
              </div>
            );
          } else if (val[0] === "price") {
            return (
              <div key={idx}>
                <div>
                  <h1>Price</h1>
                  <p>{val[1]}</p>
                </div>
              </div>
              
            );
          } else if (
            val[0] !== "status" 
            && val[0] !== "room_id" 
            && val[0] !== "room_name" 
            && val[0] !== "users_q"  
            && val[0] !== "_id"
            && val[0] !== "active_users"
            && val[0] !== "move_idx"
          ) {
            return <div key={idx}><p>{val[1]}</p></div>;
          }
        }) : "Load data about product..."}
    </div>
  );
}

export default ProductBlock;