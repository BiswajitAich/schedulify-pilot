import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const res = await fetch(
      `${process.env.BACKEND_API}users/v1/delete-user/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log("Delete user error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete user",
    });
  }
}
