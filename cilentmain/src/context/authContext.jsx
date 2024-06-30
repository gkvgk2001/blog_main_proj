import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    //to get user info from local host
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:8800/api/auth/login",
      inputs,
      {
        withCredentials: true,
      }
    );
    setCurrentUser(res.data);
  };

  const logout = async () => {
    await axios.post(
      "http://localhost:8800/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setCurrentUser(null);
  };

  //whenver current user changes i t updates the local storage

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
