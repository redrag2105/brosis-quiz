import { type ReactNode, useReducer } from "react";
import { AppContext } from "./context";
import {
  initialState,
  appReducer,
} from "./types";

// Context provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
