import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // still valid
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
