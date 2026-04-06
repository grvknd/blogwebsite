import React, { createContext, useContext, useState, useMemo } from "react";
import type { User } from "../api/users";
import { loginUser, registerUser } from "../api/users";
import { toast } from "react-toastify";

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (user: Omit<User, "id">) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);

      
      toast.success(`Welcome back, ${user.name}!`);

    } catch (err) {
      // Optional: toast on login failure
      toast.error("Invalid email or password");
      throw err;
    }
  };

  const register = async (userInput: Omit<User, "id">) => {
    try {
      const created = await registerUser(userInput);
      setCurrentUser(created);

      // ✅ Toast on register success
      toast.success("Account created successfully!");

    } catch (err) {
      toast.error("Registration failed");
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);

    // ✅ Toast on logout
    toast.info("Logged out successfully");
  };

  const value = useMemo(
    () => ({ currentUser, login, register, logout }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
