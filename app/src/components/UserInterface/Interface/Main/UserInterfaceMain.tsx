import React from "react";
import RoomPrevieBlock from "./components/RoomPrevieBlock/RoomPrevieBlock";

const UserInterfaceMain = () => {

  const [mounted, setMounted] = React.useState(false);

  let roomsList : React.MutableRefObject<{
    [key:string] :string|number|boolean,
  }[]> = React.useRef([]);

  React.useEffect(()=> {
    fetch("/trade/history/get", {
      method: "POST"
    })
      .then(res=> res.ok ? res.json(): console.error)
      .then(data=> {
        roomsList.current = data;
        setMounted(true);
      })
      .catch(err=>console.log(err));
    }, []);

  return (
    <main>
      <div>{!mounted ? "Still loading..." : 
            roomsList.current.map((val, idx)=> {
              return <RoomPrevieBlock roomData={val} key={idx} />;
            })}</div>
    </main>
  );
}

export default UserInterfaceMain;