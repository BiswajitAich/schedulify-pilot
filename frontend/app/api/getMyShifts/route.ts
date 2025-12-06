import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const employeeId = url.searchParams.get("id");
    if (!employeeId) {
      return NextResponse.json({
        success: false,
        message: "Missing employee id",
        data: null,
      });
    }
    const res = await fetch(
      `${process.env.BACKEND_API}shifts/v1/get-my-shifts/${employeeId}/`,
      { next: { revalidate: 30 } }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("getMyShifts error:", err);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch shifts",
      data: null,
    });
  }
}
