import { createContext} from "react";

export const CountContext = createContext({
  goodCount: 0,
  setGoodCount: () => {},
  badCount: 0,
  setBadCount: () => {},
  setReportImg: () => {},
  setCapturedList: () => {},
});