// app/api/profile/update-photos/route.ts

import { NextRequest, NextResponse } from "next/server";
import PrismaClient from "@prisma/client"; // your prisma client
import { parse } from "path";
import { writeFile } from "fs/promises";

const prisma = new PrismaClient.PrismaClient();
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const userId = Number(formData.get("userId")); // pass userId in form
  const profilePhoto = formData.get("profilePhoto") as File | null;
  const coverPhoto = formData.get("coverPhoto") as File | null;

  const updates: any = {};

  // Handle profile photo
  if (profilePhoto) {
    const bytes = await profilePhoto.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `profile-${Date.now()}-${profilePhoto.name}`;
    const path = `./public/uploads/profile/${filename}`;
    await writeFile(path, buffer);
    updates.profilePhotoUrl = `/uploads/profile/${filename}`;
  }

  // Handle cover photo
  if (coverPhoto) {
    const bytes = await coverPhoto.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `cover-${Date.now()}-${coverPhoto.name}`;
    const path = `./public/uploads/cover/${filename}`;
    await writeFile(path, buffer);
    updates.coverPhotoUrl = `/uploads/cover/${filename}`;
  }

  // Save to DB
  await prisma.user.update({
    where: { id: userId },
    data: updates,
  });

  return NextResponse.json({ success: true, updates });
}
