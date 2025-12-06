"use client";

import { Activity, useState } from "react";
import { login } from "../authAction";
import styles from "../styles/login.module.css";
import Image from "next/image";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleLogin = async () => {
    setErrMsg("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setErrMsg("Invalid email format");
    }

    if (!password || password.length < 8) {
      return setErrMsg("Password must be at least 8 characters");
    }

    const res = await login(email, password);
    if (!res.success) return setErrMsg(res.message!);
  };

  return (
    <div className={styles.loginContainer}>
      <form
        className={styles.loginForm}
        onSubmit={async (e) => {
          e.preventDefault();
          await handleLogin();
        }}
      >
        <Activity mode="visible">
          <fieldset>
            <legend>login</legend>

            <div className={styles.inputGroup}>
              <label htmlFor="loginEmail">email:</label>
              <input
                id="loginEmail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter your email..."
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="loginPassword">password:</label>
              <input
                id="loginPassword"
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter password..."
                maxLength={16}
              />
              <button
                type="button"
                className={styles.showHideButton}
                onClick={() => setPasswordVisible((prev) => !prev)}
              >
                <Image
                  src={passwordVisible ? "/eye-open.svg" : "/eye-close.svg"}
                  height={40}
                  width={40}
                  alt={passwordVisible ? "hide" : "show"}
                />
              </button>
            </div>

            <button type="submit" className={styles.submitButton}>
              Login
            </button>
          </fieldset>
        </Activity>
      </form>

      {errMsg && <p className={styles.errorMessage}>{errMsg}</p>}
    </div>
  );
};

export default Login;
