import { NextRequest, NextResponse } from "next/server";
import PrismaClient from "@prisma/client";           // adjust path to your prisma client
import jwt from "jsonwebtoken";
const prisma = new PrismaClient.PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// business‑rule constants
const QUALIFICATION_BONUS = 1250;
const SECURITY_PERCENTAGE = 12.0;

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Authenticate
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const token = auth.substring(7);
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }
    const userId = payload.userId;
    if (!userId) {
      return NextResponse.json({ success: false, error: "Invalid token payload" }, { status: 401 });
    }

    // 2️⃣ Parse & validate input
    const { appliedAmount } = await req.json();
    if (typeof appliedAmount !== "number" || appliedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid appliedAmount" },
        { status: 400 }
      );
    }

    // 3️⃣ Calculate derived values
    const qualifiedAmount = appliedAmount + QUALIFICATION_BONUS;
    const securityAmount = (qualifiedAmount * SECURITY_PERCENTAGE) / 100;

    // 4️⃣ Persist
    const loan = await prisma.loan.create({
      data: {
        userId,
        appliedAmount,
        qualifiedAmount,
        securityPercentage: SECURITY_PERCENTAGE,
        securityAmount,
        repaymentPeriod: "30 days", // adjust default or accept from client
        status: "pending",
      },
    });

    // 5️⃣ Return
    return NextResponse.json({
      success: true,
      data: {
        loanId: loan.id,
        appliedAmount: loan.appliedAmount,
        qualifiedAmount: loan.qualifiedAmount,
        securityAmount: loan.securityAmount,
      },
    });
  } catch (err) {
    console.error("Apply Loan API error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
