import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const url = req.nextUrl.pathname;

  if (token && url === "/auth") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (!token && url !== "/" && url !== "/auth") {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
