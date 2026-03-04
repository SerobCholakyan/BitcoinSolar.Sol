import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: Request) {
  const url = new URL(req.url);

  const protectedPaths = ["/dashboard"];
  const isProtected = protectedPaths.some((p) => url.pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const session = req.headers.get("cookie")?.match(/session=([^;]+)/)?.[1];

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(session, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
