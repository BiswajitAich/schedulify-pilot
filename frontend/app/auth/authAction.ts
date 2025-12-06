"use server";
import jwt from "jsonwebtoken";
import { sendOtpEmail, verifyOtpCode } from "@biswajitaich/email-auth";
import { resetCookie, setCookie } from "../_utils/cookie";
import { redirect } from "next/navigation";
import { ActionResult } from "../types";

export const sendOTPToEmail = async (email: string): Promise<ActionResult> => {
  try {
    const result = await sendOtpEmail(email, "YourCompany");
    if (result) {
      return { success: result.success, message: result.message };
    }
    return { success: false };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to send OTP" };
  }
};

export const verifyOTP = async (
  email: string,
  otp: string
): Promise<ActionResult> => {
  try {
    // TODO: verify OTP for that email
    const verifyResult = await verifyOtpCode(email, otp);
    if (verifyResult) {
      return {
        success: verifyResult.success,
      };
    }
    return { success: false };
  } catch (error) {
    console.error(error);
    return { success: false, message: "OTP verification failed" };
  }
};

export const signup = async (data: FormData): Promise<ActionResult> => {
  try {
    const firstname = data.get("userFirstName")?.toString() || "";
    const lastname = data.get("userLastName")?.toString() || "";
    const email = data.get("email")?.toString() || "";
    const password = data.get("password")?.toString() || "";

    console.log("Signup data send!");
    const res = await fetch(`${process.env.BACKEND_API}auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
      }),
    });
    if (!res.ok) return { success: false, message: "server error!" };
    const resData: ActionResult = await res.json();
    console.log(resData);
    if (resData.success) {
      const auth_token = jwt.sign(
        { ...resData.user_data },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: "7d" }
      );

      await setCookie(auth_token);
    }

    return {
      success: resData.success,
      message: resData.message,
      user_data: resData.user_data,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Signup failed" };
  }
};

export const login = async (
  email: string,
  password: string
): Promise<ActionResult> => {
  try {
    console.log("login data send !");

    const res = await fetch(`${process.env.BACKEND_API}auth/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (!res.ok) {
      await resetCookie();
      return { success: false, message: "server error!" };
    }
    const resData: ActionResult = await res.json();
    console.log(resData);
    if (!resData.user_data) {
      return { success: false, message: "Invalid user data from server." };
    }

    const auth_token = jwt.sign(
      { ...resData.user_data },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "7d" }
    );

    await setCookie(auth_token);
  } catch (error) {
    console.error(error);
    return { success: false, message: "login failed" };
  }
  redirect("/home");
};
