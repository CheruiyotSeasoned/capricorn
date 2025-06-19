// src/app/api/loans/activity/route.ts
import { NextRequest, NextResponse } from "next/server";
import PrismaClient from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient.PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

type Bucket = { x: string; y: number };

function bucketByTime(
  rows: { amount: number; timestamp: Date }[],
  frame: "daily" | "weekly" | "monthly"
): Bucket[] {
  const map = new Map<string, number>();
  rows.forEach(({ amount, timestamp }) => {
    let key: string;
    if (frame === "daily") {
      key = timestamp.toISOString().slice(0, 10);
    } else if (frame === "weekly") {
      // get year-week
      const wk = Math.ceil(
        ((timestamp.getTime() -
          new Date(timestamp.getFullYear(), 0, 1).getTime()) /
          86400000 +
          new Date(timestamp.getFullYear(), 0, 1).getDay() +
          1) /
          7
      );
      key = `${timestamp.getFullYear()}-W${wk}`;
    } else {
      key = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, "0")}`;
    }
    map.set(key, (map.get(key) || 0) + amount);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([x, y]) => ({ x, y }));
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  let payload: any;
  try {
    payload = jwt.verify(auth.slice(7), JWT_SECRET);
  } catch {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  }
  const userId = payload.userId;
  const frame = (req.nextUrl.searchParams.get("timeFrame") as "daily" | "weekly" | "monthly") || "monthly";

  // // 1️⃣ Repaid series (payments table, status “PAID”)
  // const repaidRows = await prisma.payment.findMany({
  //   where: { userId, status: "PAID" },
  //   select: { amount: true, createdAt: true },
  // });

  // // 2️⃣ Upcoming Due (paymentSchedule table, status “pending”)
  // const dueRows = await prisma.paymentSchedule.findMany({
  //   where: { userId, status: "pending" },
  //   select: { amount: true, dueDate: true },
  // });

  // const received = bucketByTime(
  //   repaidRows.map((r: { amount: any; createdAt: Date; }) => ({ amount: Number(r.amount), timestamp: r.createdAt })),
  //   frame
  // );
  // const due = bucketByTime(
  //   dueRows.map((r: { amount: any; dueDate: Date; }) => ({ amount: Number(r.amount), timestamp: r.dueDate })),
  //   frame
  // );

  return NextResponse.json({ success: true, data: null });
}
