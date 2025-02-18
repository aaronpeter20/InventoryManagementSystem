import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const url = "https://inventorymanagementsystem-backend-z88f.onrender.com";


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email, password) => {
    const { data } = await axios.post(`${url}/api/auth/login`, { email, password });
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const signup = async (name, email, password, role) => {
    try {
      const { data } = await axios.post(`${url}/api/auth/signup`, { name, email, password, role });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data)); 
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to sign up");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); 
  };

  const isAdmin = () => user?.role === "admin";
  const isManager = () => user?.role === "manager";
  const isEmployee = () => user?.role === "employee";

  return (
    <AuthContext.Provider value={{ user, login,signup, logout, isAdmin, isManager, isEmployee }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
