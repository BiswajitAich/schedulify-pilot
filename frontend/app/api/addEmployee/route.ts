import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { firstname, lastname, email, password, department } =
      await req.json();
    const res = await fetch(
      `${process.env.BACKEND_API}users/v1/add-employee/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
          department,
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
