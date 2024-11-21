import HistoryView from "./NavViews/HistoryView";
import RoomView from "./NavViews/RoomView";


interface NavElm {
  id: number,
  name : string,
  view : JSX.Element,
}

export const TradeViewNav : Array<NavElm> = [
  {
    id: 1,
    name : "Room",
    view : <RoomView />,
  },
  {
    id: 2,
    name : "History",
    view : <HistoryView />,
  }
];