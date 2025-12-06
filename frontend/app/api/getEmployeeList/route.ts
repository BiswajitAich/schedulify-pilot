import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API}users/v1/get-employee-list/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 30 },
      }
    );
    if (!res.ok) {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch from backend",
        data: [],
      });
    }
    const data = await res.json();
    console.log(data);

    return NextResponse.json({
      success: data.success,
      message: data.message,
      data: data.data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      data: [],
    });
  }
}
