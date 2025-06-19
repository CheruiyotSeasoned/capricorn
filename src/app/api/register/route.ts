import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      nationalId,
      phoneNumber,
      addressCounty,
      addressTown,
      emergencyName,
      emergencyPhone,
      password,
    } = body;

    // Check required fields
    if (
      !fullName ||
      !nationalId ||
      !phoneNumber ||
      !addressCounty ||
      !addressTown ||
      !emergencyName ||
      !emergencyPhone ||
      !password
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { nationalId },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this National ID already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    await prisma.user.create({
      data: {
        fullName,
        nationalId,
        phoneNumber,
        addressCounty,
        addressTown,
        emergencyName,
        emergencyPhone,
        passwordHash,
      },
    });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
