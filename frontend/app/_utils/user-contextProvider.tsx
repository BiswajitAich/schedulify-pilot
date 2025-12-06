"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserData } from "../types";
export type UIUserData = Omit<UserData, "id">;
const defaultUser = {
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  role: "",
  employee_code: "",
  department: "",
};
const UserContext = createContext<UserData>(defaultUser);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userData, setUserData] = useState<UserData>(defaultUser);
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/getUser", {
        method: "GET",
      });
      const data = (await res.json()).user ?? defaultUser;
      console.log(data);
      setUserData(data);
    } catch (error) {
      setUserData(defaultUser);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
