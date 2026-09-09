import { useContext } from "react";
import { AppContext, AppContextType } from "../contexts/AppContext";

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
