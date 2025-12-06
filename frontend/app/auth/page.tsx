"use client";

import { Activity, useState } from "react";
import Login from "./_authComponents/Login";
import Signup from "./_authComponents/Signup";
import styles from "./styles/auth.module.css";

const Authpage = () => {
  const [authState, setAuthState] = useState<"signup" | "login">("login");

  return (
    <div className={styles.authContainer}>
      <Activity mode={authState === "login" ? "visible" : "hidden"}>
        <Login />
      </Activity>

      <Activity mode={authState === "signup" ? "visible" : "hidden"}>
        <Signup />
      </Activity>

      <button
        className={styles.toggleButton}
        onClick={() =>
          setAuthState((prev) => (prev === "login" ? "signup" : "login"))
        }
      >
        <p>{authState === "login" ? "signup" : "login"}</p>
      </button>
    </div>
  );
};

export default Authpage;
