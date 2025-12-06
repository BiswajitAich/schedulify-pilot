import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API}shifts/v1/get-all-shifts/`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 30 },
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("getAllShifts error:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch shifts",
      data: null,
    });
  }
}
