import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { nationalId } = await req.json();

    if (!nationalId) {
      return NextResponse.json({ error: "National ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { nationalId },
    });

    if (!user || !user.email) {
      return NextResponse.json({ error: "No user found with this National ID or email missing" }, { status: 404 });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Optionally save token to DB (for now just send it)
    // You can add resetToken & expiry in your model later

      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1); // token valid 1 hour

      // Save token & expiry to user
      await prisma.user.update({
        where: { nationalId },
        data: {
          resetToken: token,
          resetTokenExpiry: expiry,
        },
      });


    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465", 10),
      secure: true, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user.id}`;

    await transporter.sendMail({
      from: '"Capricorn Credits" <info@wirafy.online>',
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.fullName},</p>
        <p>You requested to reset your password. Click the link below:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    console.log(`Reset email sent to: ${user.email}`);

    return NextResponse.json({ message: `Reset instructions sent to email: ${user.email}` }, { status: 200 });
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
