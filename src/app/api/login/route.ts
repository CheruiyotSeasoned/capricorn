import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nationalId, password } = body;

    const user = await prisma.user.findUnique({
      where: { nationalId: nationalId }, // adjust if using email or phoneNumber
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
      });
    }

const token = jwt.sign(
  {
    userId: user.id,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    profilePhoto: user.profilePhotoUrl || "/images/user/default-user.png",
    coverPhoto: user.coverPhotoUrl || "/images/cover/default-cover.png",
    addressTown: user.addressTown || "",
    addressCountry: user.addressCounty || "",
  },
  JWT_SECRET || "your_jwt_secret",
  { expiresIn: "7d" }
);

    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("cheruiyot Login error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
