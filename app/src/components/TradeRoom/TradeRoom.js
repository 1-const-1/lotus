"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const ProductBlock_1 = __importDefault(require("./components/ProductBlock/ProductBlock"));
const ClientMenu_1 = __importDefault(require("./components/ClientMenu/ClientMenu"));
const ActiveUsers_1 = __importDefault(require("./components/ActiveUsers/ActiveUsers"));
const AdminMenu_1 = __importDefault(require("./components/AdminMenu/AdminMenu"));
require("./style/TradeRoom.css");
const socket = (0, socket_io_client_1.default)({ autoConnect: false }).connect();
const TradeRoom = () => {
    const location = (0, react_router_dom_1.useLocation)();
    const params = new URLSearchParams(location.search);
    const ROOM_ID = params.get("id");
    const [isAdmin, setIsAdmin] = react_1.default.useState(false);
    const [roomInfo, setRoomInfo] = react_1.default.useState({});
    const [usersInfo, setUsersInfo] = react_1.default.useState();
    const [activeSession, setActiveSession] = react_1.default.useState(false);
    const [userId, setUserId] = react_1.default.useState(""); // <-- the current user
    const [userForm, showUserForm] = react_1.default.useState(false);
    const [mounted, setMounted] = react_1.default.useState(false);
    const [usersMounted, setUsersMounted] = react_1.default.useState(false);
    const [joinedUser, setJoinedUser] = react_1.default.useState(""); // <-- a new joined user
    const [leftUser, setLeftUser] = react_1.default.useState(""); // <-- a joined user decided to leave
    const [changedUserOffer, setChangedUserOffer] = react_1.default.useState(""); // <-- when a user (consumer) decided to change data
    const [activeUser, setActiveUser] = react_1.default.useState(0); // <- this hook helps to identify the following statement: who is making move right now?
    let userIndex = react_1.default.useRef(0);
    const [timer, setTimer] = react_1.default.useState(30);
    react_1.default.useEffect(() => {
        socket.emit("trade_room", ROOM_ID);
    }, []);
    react_1.default.useEffect(() => {
        fetch("/trade/room/user_id", { method: "POST" })
            .then(res => {
            if (res.ok) {
                return res.json();
            }
            else {
                console.log("Response is not OK!");
            }
        })
            .then(data => setUserId(data.user_id))
            .catch(err => console.log(err));
    }, []);
    react_1.default.useEffect(() => {
        fetch("/trade/room/user_status", { method: "POST" })
            .then((res) => {
            if (res.ok) {
                return res.json();
            }
            else {
                console.log("Response is not OK!");
            }
        })
            .then((data) => { setIsAdmin(data.value); })
            .catch(err => console.log(err));
    }, []);
    react_1.default.useEffect(() => {
        setUsersMounted(false);
        fetch("/trade/room/product_data", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ room_id: ROOM_ID }),
        })
            .then(res => {
            if (res.ok) {
                return res.json();
            }
            else {
                console.log("Response is not OK!");
            }
        })
            .then(data => {
            setRoomInfo(data);
            setActiveSession(data.active_session);
            setActiveUser(data.move_idx);
            setMounted(true); // <- This will mount a page and hides unnecessary queries to my MongoDB
            setUsersMounted(true); // <- so... if queries are asynchronous then  i need  to wait when all necessary data will be mounted including users to represent this correctly
            setChangedUserOffer(""); // <- change back because it will not make a query to update the info about the current room. The user will be able to see only one change if it will not have this method
        })
            .catch(err => console.log(err));
    }, [joinedUser, leftUser, changedUserOffer, activeUser, activeSession]);
    react_1.default.useEffect(() => {
        if (ROOM_ID && userId) {
            fetch("/trade/room/user/index", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ room_id: ROOM_ID, user_id: userId }),
            })
                .then(res => {
                if (res.ok) {
                    console.log("Response is OK!");
                    return res.json();
                }
                else {
                    console.log("Response is not OK!");
                }
            })
                .then(data => {
                userIndex.current = data.user_index;
            })
                .catch(err => console.log(err));
        }
    }, [joinedUser, leftUser, ROOM_ID, userId]);
    react_1.default.useEffect(() => {
        if (ROOM_ID) {
            fetch("/trade/room/users/info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ room_id: ROOM_ID }),
            })
                .then(res => {
                if (res.ok) {
                    console.log("Response is OK!");
                    return res.json();
                }
                else {
                    console.log("Response is not OK!");
                }
            })
                .then(data => {
                setUsersInfo(data);
            })
                .catch(err => console.log(err));
        }
    }, [ROOM_ID]);
    react_1.default.useEffect(() => {
        socket.on("connect_new_user", (user_id) => {
            console.log(`new user has just joined: ${user_id}`);
            setJoinedUser(user_id);
        });
        return () => {
            socket.off("connect_new_user");
        };
    }, []);
    react_1.default.useEffect(() => {
        socket.on("user_leaves_evt", (user_id) => {
            console.log(`user has just left: ${user_id}`);
            setLeftUser(user_id);
        });
        return () => {
            socket.off("user_leaves_evt");
        };
    }, []);
    react_1.default.useEffect(() => {
        socket.on("user_changes_offer_evt", (user_id) => {
            console.log(`user has just updatet his offer: ${user_id}`);
            setChangedUserOffer(user_id);
        });
        return () => {
            socket.off("user_changes_offer_evt");
        };
    }, []);
    react_1.default.useEffect(() => {
        socket.on("user_make_move_evt", (jData) => {
            setActiveUser(jData.move_idx);
        });
        return () => {
            socket.off("user_make_move_evt");
        };
    }, []);
    react_1.default.useEffect(() => {
        socket.on("trade_room_timer_res", (socketTime) => {
            setTimer(socketTime);
        });
        return () => {
            socket.off("trade_room_timer_res");
        };
    }, []);
    react_1.default.useEffect(() => {
        socket.on("trade_room_timer_end", (data, socket_id) => {
            if (socket.id === socket_id) {
                socket.emit("user_make_move_req", { room_id: ROOM_ID, user_id: userId }, activeUser, activeUser);
                socket.emit("trade_room_timer_start", { room_id: ROOM_ID }, 30, socket.id);
            }
        });
        return () => {
            socket.off("trade_room_timer_end");
        };
    }, [activeUser, userIndex]);
    react_1.default.useEffect(() => {
        socket.on("trade_room_session_start_evt", () => {
            setActiveSession(true);
        });
        return () => {
            socket.off("trade_room_session_start_evt");
        };
    }, []);
    react_1.default.useEffect(() => {
        socket.on("trade_room_session_end_evt", () => {
            setActiveSession(false);
        });
        return () => {
            socket.off("trade_room_session_end_evt");
        };
    }, []);
    return mounted ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "info-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "product-container", children: (0, jsx_runtime_1.jsx)(ProductBlock_1.default, { rInfo: roomInfo }) }), (0, jsx_runtime_1.jsx)("div", { className: "users-container", children: usersMounted
                            ? (0, jsx_runtime_1.jsx)(ActiveUsers_1.default, { rInfo: roomInfo, user_id: userId, room_id: ROOM_ID, socket: socket, timer: timer, usersInfo: usersInfo })
                            : (0, jsx_runtime_1.jsx)("p", { children: "Load active users..." }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "menu-container", children: isAdmin
                    ? (0, jsx_runtime_1.jsx)(AdminMenu_1.default, { room_id: ROOM_ID, socket: socket, active_session: activeSession })
                    : (0, jsx_runtime_1.jsx)(ClientMenu_1.default, { rData: roomInfo, ufBool: userForm, ufSetter: showUserForm, room_id: ROOM_ID, user_id: userId, socket: socket, activeUser: activeUser, user_index: userIndex.current, active_session: activeSession }) })] })) : (0, jsx_runtime_1.jsx)("p", { children: "Load room..." });
};
exports.default = TradeRoom;
