import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Authenticate
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const payload = await verifyJwt(token);
    if (!payload?.userId) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }
    const userId = payload.userId;

    // 2️⃣ Aggregations
    const totalLoanAmount = await prisma.loan.aggregate({
      where: { userId },
      _sum: { qualifiedAmount: true },
    });
    const totalPayments = await prisma.payment.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
    const activeLoanAmount = await prisma.loan.aggregate({
      where: { userId, status: "active" },
      _sum: { qualifiedAmount: true },
    });
const activeLoanValue = Number(activeLoanAmount._sum.qualifiedAmount ?? 0);
const totalPaymentsValue = Number(totalPayments._sum.amount ?? 0);

const remainingBalance = activeLoanValue - totalPaymentsValue;
    // const remainingBalance =
    //   (activeLoanAmount._sum.qualifiedAmount || 0) -
    //   (totalPayments._sum.amount || 0);

    const nextPayment = await prisma.paymentSchedule.findFirst({
      where: {
        userId,
        dueDate: { gte: new Date() },
        status: "pending",
      },
      orderBy: { dueDate: "asc" },
    });

    // 3️⃣ Latest single loan
    const latestLoanRecord = await prisma.loan.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        appliedAmount: true,
        qualifiedAmount: true,
        securityAmount: true,
        status: true,
      },
    });

    // 4️⃣ Return structured payload
    return NextResponse.json({
      success: true,
      data: {
        totalLoanAmount: {
          value: totalLoanAmount._sum.qualifiedAmount || 0,
        },
        outstandingBalance: {
          value: Math.max(remainingBalance, 0),
        },
        totalPaid: {
          value: totalPayments._sum.amount || 0,
        },
        nextDueDate: {
          value: nextPayment?.dueDate.toISOString() || null,
        },
        latestLoan: latestLoanRecord ?? {
          appliedAmount: 0,
          qualifiedAmount: 0,
          securityAmount: 0,
          status: "pending",
        },
      },
    });
  } catch (error: any) {
    console.error("Loan Overview API Error:", error);
    return NextResponse.json(
      { success: false, error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
