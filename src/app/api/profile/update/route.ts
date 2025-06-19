import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJwt } from "@/lib/utils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phoneNumber, email } = body;

    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJwt(token);

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.userId; // correct user id now

    if (!fullName || !phoneNumber || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) }, // assuming id is integer PK
      data: {
        fullName,
        phoneNumber,
        email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Something went wrong: ${errorMessage}` },
      { status: 500 }
    );
  }
}
