import { getUserFromCookie, resetCookie } from "@/app/_utils/cookie";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getUserFromCookie();
    if (!user) await resetCookie();
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
}
