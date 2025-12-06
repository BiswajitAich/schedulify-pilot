import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, date, start_time, end_time, created_by } = await req.json();
    const res = await fetch(
      `${process.env.BACKEND_API}shifts/v1/add-employee-shifts/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          date,
          start_time,
          end_time,
          created_by,
        }),
      }
    );
    const data = await res.json();
    return NextResponse.json({
      success: data.success,
      message: data.message,
    });
  } catch (error) {
    console.log(error);
  }
}
