import { createContext } from "react";
import type { AppState, AppAction } from "./types";

// Context creation
export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);
