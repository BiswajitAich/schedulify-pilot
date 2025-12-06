"use client";

import { Activity, useState } from "react";
import { sendOTPToEmail, signup, verifyOTP } from "../authAction";
import styles from "../styles/signup.module.css";
import Image from "next/image";

enum SignupStep {
  Email = 1,
  OTP,
  Password,
  Submit,
}

const Signup = () => {
  const [signupState, setSignupState] = useState(SignupStep.Email);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [password, setPassword] = useState({ p: "", cp: "" });
  const [passwordView, setPasswordView] = useState({
    pDisplay: false,
    cPDisplay: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleNext = async () => {
    setErrMsg("");
    setLoading(true);
    try {
      switch (signupState) {
        case SignupStep.Email: {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setErrMsg("Invalid email format");
            return;
          }

          const res = await sendOTPToEmail(email);
          if (!res.success) return setErrMsg(res.message!);
          break;
        }

        case SignupStep.OTP: {
          if (otp.length !== 6) {
            setErrMsg("OTP must be 6 digits");
            return;
          }

          const res = await verifyOTP(email, otp);
          if (!res.success) {
            setErrMsg(res.message!);
            return;
          }
          break;
        }

        case SignupStep.Password: {
          if (password.p.length < 8) {
            setErrMsg("Password must be at least 8 characters");
            return;
          }

          if (password.p !== password.cp) {
            setErrMsg("Passwords do not match");
            return;
          }
          break;
        }
      }
      setSignupState((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 4;

  return (
    <div className={styles.signupContainer}>
      <form
        className={styles.signupForm}
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            const formData = new FormData(e.currentTarget);
            setErrMsg((await signup(formData)).message ?? "");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div
          className={styles.progressBar}
          style={{
            width: `${(signupState / totalSteps) * 100}%`,
          }}
        />

        {/* Email Step */}
        <Activity
          mode={signupState === SignupStep.Email ? "visible" : "hidden"}
        >
          <fieldset>
            <legend>email verification</legend>

            <div className={styles.inputGroup}>
              <label htmlFor="email">email:</label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="button"
              className={styles.nextButton}
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? "sending otp..." : "send otp"}
            </button>
          </fieldset>
        </Activity>

        {/* OTP Step */}
        <Activity mode={signupState === SignupStep.OTP ? "visible" : "hidden"}>
          <fieldset>
            <legend>otp verification</legend>

            <div className={styles.inputGroup}>
              <label htmlFor="otp">otp:</label>
              <input
                id="otp"
                type="number"
                inputMode="numeric"
                value={otp}
                onChange={(e) =>
                  e.target.value.length <= 6 && setOtp(e.target.value)
                }
                placeholder="0 0 0 0 0 0"
                required
              />
            </div>

            <button
              type="button"
              className={styles.nextButton}
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? "verifying..." : "verify otp"}
            </button>
          </fieldset>
        </Activity>

        {/* Password Step */}
        <Activity
          mode={signupState === SignupStep.Password ? "visible" : "hidden"}
        >
          <fieldset>
            <legend>set password</legend>

            <div className={styles.inputGroup}>
              <label htmlFor="password">password:</label>
              <input
                id="password"
                name="password"
                type={passwordView.pDisplay ? "text" : "password"}
                value={password.p}
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, p: e.target.value }))
                }
                maxLength={16}
                required
                autoComplete="new-password"
                placeholder="Enter pasword..."
              />
              <button
                type="button"
                className={styles.showHideButton}
                disabled={loading}
                onClick={() =>
                  setPasswordView((prev) => ({
                    ...prev,
                    pDisplay: !prev.pDisplay,
                  }))
                }
              >
                <Image
                  src={
                    passwordView.pDisplay ? "/eye-open.svg" : "/eye-close.svg"
                  }
                  height={40}
                  width={40}
                  alt={passwordView.pDisplay ? "hide" : "show"}
                />
              </button>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">confirm password:</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={passwordView.cPDisplay ? "text" : "password"}
                value={password.cp}
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, cp: e.target.value }))
                }
                maxLength={16}
                required
                autoComplete="new-password"
                placeholder="Confirm pasword..."
              />
              <button
                type="button"
                className={styles.showHideButton}
                disabled={loading}
                onClick={() =>
                  setPasswordView((prev) => ({
                    ...prev,
                    cPDisplay: !prev.cPDisplay,
                  }))
                }
              >
                <Image
                  src={
                    passwordView.cPDisplay ? "/eye-open.svg" : "/eye-close.svg"
                  }
                  height={40}
                  width={40}
                  alt={passwordView.cPDisplay ? "hide" : "show"}
                />
              </button>
            </div>

            <button
              type="button"
              className={styles.nextButton}
              onClick={handleNext}
              disabled={loading}
            >
              Next
            </button>
          </fieldset>
        </Activity>

        {/* Final Step */}
        <Activity
          mode={signupState === SignupStep.Submit ? "visible" : "hidden"}
        >
          <legend>Last step</legend>
          <p className={styles.successText}>email verified ✓</p>
          <p className={styles.successText}>password set ✓</p>
          <p>all done! now enter your details:</p>

          <div className={styles.inputGroup}>
            <label htmlFor="userFirstName">first name:</label>
            <input
              id="userFirstName"
              name="userFirstName"
              type="text"
              maxLength={16}
              required
              autoComplete="given-name"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="userLastName">last name:</label>
            <input
              id="userLastName"
              name="userLastName"
              type="text"
              maxLength={16}
              required
              autoComplete="family-name"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "please wait..." : "Sign up"}
          </button>
        </Activity>
      </form>

      {errMsg && <p className={styles.errorMessage}>{errMsg}</p>}
    </div>
  );
};

export default Signup;
