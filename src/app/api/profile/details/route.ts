import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJwt } from "@/lib/utils";
import jwt from "jsonwebtoken";
import { error } from "console";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET(req: Request) {
  try {
  const authHeader = req.headers.get("Authorization");
 
     if (!authHeader || !authHeader.startsWith("Bearer ")) {
       return NextResponse.json(
         { success: false, error: "Unauthorized" },
         { status: 401 }
       );
     }
 
     const token = authHeader.split(" ")[1];
     const payload = await verifyJwt(token);
 
     if (!payload || !payload.userId) {
       return NextResponse.json(
         { success: false, error: "Invalid token" },
         { status: 401 }
       );
     }

    const userId = payload?.userId;
    if (!userId) {
      return NextResponse.json({ success: false, error: "Invalid token payload" }, { status: 401 });
    }

    // Fetch user profile
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    fullName: true,
    phoneNumber: true,
    profilePhotoUrl: true,
    coverPhotoUrl: true,
    addressTown: true,
    addressCounty: true,
    loans: {
      orderBy: { createdAt: "desc" },
      take: 1,
      select: {
        appliedAmount: true,
        qualifiedAmount: true,
        securityAmount: true,
        status: true,
      },
    },
  },
});


if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

return NextResponse.json({ success: true, data: user });

  } catch (err) {
    console.error("Profile GET error:", err);
    return NextResponse.json({ success: false, error: `Server error: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
  }
}
