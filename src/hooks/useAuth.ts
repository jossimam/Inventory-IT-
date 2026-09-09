import { useAppContext } from "./useAppContext";
import { User } from "../types";

export function useAuth() {
  const { currentUser, login, logout, setCurrentUser } = useAppContext();
  
  return {
    currentUser,
    login,
    logout,
    setCurrentUser,
    isAuthenticated: !!currentUser,
    role: currentUser?.role || null,
    name: currentUser?.name || null,
    email: currentUser?.email || null,
  };
}
