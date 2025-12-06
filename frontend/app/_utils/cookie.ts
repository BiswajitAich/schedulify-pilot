"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { SetCookieOptions, UserData } from "../types";

export const setCookie = async (auth_token: string): Promise<void> => {
  try {
    (await cookies()).set("auth_token", auth_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    } as SetCookieOptions);
  } catch (error) {
    console.error("failed to set cookie!");
  }
};

export const resetCookie = async () => {
  try {
    (await cookies()).delete("auth_token");
    console.log("User logged out successfully!");
  } catch (error) {
    console.error("failed to set cookie!");
  }
  redirect("/auth");
};

export const checkCookie = async () => {
  try {
    return !!(await cookies()).get("auth_token");
  } catch (error) {
    console.error("failed to check Cookie!");
    return false;
  }
};

export const getUserFromCookie = async () => {
  try {
    const token = (await cookies()).get("auth_token")?.value ?? null;
    const secret = process.env.JWT_SECRET_KEY;
    if (!token || !secret) return null;
    const decoded = jwt.verify(token, secret);
    if (typeof decoded !== "object" || decoded === null) return null;
    const data = decoded as UserData;
    return {
      id: data.id,
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      profile_banner: data.profile_banner,
      profile_photo: data.profile_photo,
      role: data.role,
    };
  } catch (error) {
    console.error("failed to check Cookie!");
    return null;
  }
};
