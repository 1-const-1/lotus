import React, { useState } from "react";
import { navMenu } from "../ListMenu/NavMenu";

const DefaultView = () => {

  const [viewId, setViewId] = useState(0);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div>Empty</div>
    </div>
  );
}

export default DefaultView;