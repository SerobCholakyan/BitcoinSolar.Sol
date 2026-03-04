import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Hardcoded operator account for now
  const operator = {
    email: "admin@bitcoinsolar.org",
    passwordHash: bcrypt.hashSync("SolarAdmin123!", 10)
  };

  if (email !== operator.email) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, operator.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET!,
    { expiresIn: `${process.env.SESSION_EXPIRES_DAYS}d` }
  );

  const res = NextResponse.json({ success: true });

  res.cookies.set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/"
  });

  return res;
}
