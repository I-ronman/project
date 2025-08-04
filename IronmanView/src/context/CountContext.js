import { createContext} from "react";

export const CountContext = createContext({
  successCount: 0,
  setSuccessCount: () => {},
  failCount: 0,
  setFailCount: () => {},
  setReportImg: () => {},
  setCapturedList: () => {},
});