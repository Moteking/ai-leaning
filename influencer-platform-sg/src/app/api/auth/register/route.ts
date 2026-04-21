import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, name, role, company, handle } = body;

  if (!email || !password || !name || !role) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role,
      company: role === "brand" ? company : null,
    },
  });

  if (role === "creator" && handle) {
    await prisma.creatorProfile.create({
      data: {
        userId: user.id,
        handle,
        displayName: name,
      },
    });
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  sendWelcomeEmail(email, name, role).catch(console.error);

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  }, { status: 201 });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
