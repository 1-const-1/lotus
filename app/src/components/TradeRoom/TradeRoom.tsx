import React from "react";
import {useLocation} from "react-router-dom";
import io, { Socket } from "socket.io-client";
import ProductBlock from "./components/ProductBlock/ProductBlock";
import ClientMenu from "./components/ClientMenu/ClientMenu";
import ActiveUsers from "./components/ActiveUsers/ActiveUsers";
import AdminMenu from "./components/AdminMenu/AdminMenu";

import "./style/TradeRoom.css";

const socket = io({autoConnect: false}).connect();


const TradeRoom = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const ROOM_ID = params.get("id");

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [roomInfo, setRoomInfo] = React.useState({} as any);
  const [usersInfo, setUsersInfo] = React.useState();
  const [activeSession, setActiveSession] = React.useState(false);

  const [userId, setUserId] = React.useState("");             // <-- the current user
  const [userForm, showUserForm] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [usersMounted, setUsersMounted] = React.useState(false);

  const [joinedUser, setJoinedUser] = React.useState("");     // <-- a new joined user
  const [leftUser, setLeftUser] = React.useState("");         // <-- a joined user decided to leave
  const [changedUserOffer, setChangedUserOffer] = React.useState(""); // <-- when a user (consumer) decided to change data
  const [activeUser, setActiveUser] = React.useState(0);     // <- this hook helps to identify the following statement: who is making move right now?
  
  let userIndex = React.useRef(0);

  const [timer, setTimer] = React.useState(30);

  React.useEffect(()=> {
    socket.emit("trade_room", ROOM_ID);
  }, []);

  React.useEffect(()=> {
    fetch("/trade/room/user_id", {method: "POST"})
      .then(res=> {
        if (res.ok) {
          return res.json();
        } else {
          console.log("Response is not OK!");
        }
      })
      .then(data=> setUserId(data.user_id))
      .catch(err=> console.log(err));
  }, [])

  React.useEffect(()=>{
    fetch ("/trade/room/user_status", {method: "POST"})
      .then((res)=> {
        if (res.ok) {
          return res.json();
        } else {
          console.log("Response is not OK!");
        }
      })
      .then((data)=> {setIsAdmin(data.value)})
      .catch(err=> console.log(err));
  }, []);

  React.useEffect(()=> {
    setUsersMounted(false);

    fetch("/trade/room/product_data", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({room_id: ROOM_ID}),
      })
        .then(res=> {
          if (res.ok) {
            return res.json();
          } else {
            console.log("Response is not OK!");
          }
        })
        .then(data=> {
          setRoomInfo(data);
          setActiveSession(data.active_session);

          setActiveUser(data.move_idx);
          setMounted(true);       // <- This will mount a page and hides unnecessary queries to my MongoDB
          setUsersMounted(true);  // <- so... if queries are asynchronous then  i need  to wait when all necessary data will be mounted including users to represent this correctly
        
          setChangedUserOffer(""); // <- change back because it will not make a query to update the info about the current room. The user will be able to see only one change if it will not have this method
        })
        .catch(err=> console.log(err));
    
  },[joinedUser, leftUser, changedUserOffer, activeUser, activeSession]);

  React.useEffect(()=> {
    if (ROOM_ID && userId) {
      fetch("/trade/room/user/index", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({room_id: ROOM_ID, user_id: userId}),
      })
        .then(res=> {
          if (res.ok) {
            console.log("Response is OK!");
            return res.json();
          } else {
            console.log("Response is not OK!");
          }
        })
        .then(data=> {
          userIndex.current = data.user_index;
        })
        .catch(err=> console.log(err));
    }

  }, [joinedUser, leftUser, ROOM_ID, userId]);

  React.useEffect(()=> {
    if (ROOM_ID) {
      fetch("/trade/room/users/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({room_id: ROOM_ID}),
      })
        .then(res=> {
          if (res.ok) {
            console.log("Response is OK!");
            return res.json();
          } else {
            console.log("Response is not OK!");
          }
        })
        .then(data=> {
          setUsersInfo(data);
        })
        .catch(err=> console.log(err));
    }
  }, [ROOM_ID]);

  React.useEffect(()=> {
    socket.on("connect_new_user", (user_id : string)=> {
      console.log(`new user has just joined: ${user_id}`);
      setJoinedUser(user_id);
    });

    return () => {
      socket.off("connect_new_user");
    };
  }, []);

  React.useEffect(()=> {
    socket.on("user_leaves_evt", (user_id : string)=> {
      console.log(`user has just left: ${user_id}`);
      setLeftUser(user_id);
    });

    return () => {
      socket.off("user_leaves_evt");
    };
  }, []);

  React.useEffect(()=> {
    socket.on("user_changes_offer_evt", (user_id : string)=> {
      console.log(`user has just updatet his offer: ${user_id}`);
      setChangedUserOffer(user_id);
    });

    return () => {
      socket.off("user_changes_offer_evt");
    }
  }, []);

  React.useEffect(()=> {
    socket.on("user_make_move_evt", (jData)=> {
      setActiveUser(jData.move_idx);
    });

    return () => {
      socket.off("user_make_move_evt");
    }
  }, []);


  React.useEffect(()=> {
    socket.on("trade_room_timer_res", (socketTime :number)=> {
      setTimer(socketTime);
    });

    return () => {
      socket.off("trade_room_timer_res");
    }
  }, []);

  React.useEffect(()=> {
    socket.on("trade_room_timer_end", (data, socket_id)=> {
      if (socket.id === socket_id) {
        socket.emit("user_make_move_req", {room_id: ROOM_ID, user_id: userId}, activeUser, activeUser);
        socket.emit("trade_room_timer_start", {room_id: ROOM_ID}, 30, socket.id);
      }
    });

    return ()=> {
      socket.off("trade_room_timer_end");
    }
  }, [activeUser, userIndex]);

  React.useEffect(()=> {
    socket.on("trade_room_session_start_evt", ()=> {
      setActiveSession(true);
    });

    return ()=> {
      socket.off("trade_room_session_start_evt");
    }
  }, []);

  React.useEffect(()=> {
    socket.on("trade_room_session_end_evt", ()=> {
      setActiveSession(false);
    });

    return ()=> {
      socket.off("trade_room_session_end_evt");
    }
  }, []);

  return mounted ? (
    <div>
      <div className="info-container">
        <div className="product-container">
          <ProductBlock rInfo={roomInfo} />
        </div>
        <div className="users-container">
          {usersMounted
            ? <ActiveUsers 
                rInfo={roomInfo}
                user_id={userId} 
                room_id={ROOM_ID}
                socket={socket}
                timer={timer}
                usersInfo={usersInfo}
                />
            : <p>Load active users...</p>}
        </div>
      </div>
      <div className="menu-container">
        {isAdmin 
          ? <AdminMenu 
              room_id={ROOM_ID}
              socket={socket}
              active_session={activeSession}/>
          : <ClientMenu 
              rData={roomInfo} 
              ufBool={userForm}
              ufSetter={showUserForm}
              room_id={ROOM_ID}
              user_id={userId}
              socket={socket}
              activeUser={activeUser}
              user_index={userIndex.current}
              active_session={activeSession} />
          }
      </div>
    </div>
  ) : <p>Load room...</p>;
}

export default TradeRoom;