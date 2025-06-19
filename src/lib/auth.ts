import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export function getTokenPayload(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as { userId: number; fullName: string; phoneNumber: string; [key: string]: any };
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
export function generateToken(user: { id: number; fullName: string; phoneNumber: string; [key: string]: any }) {
  return jwt.sign(
    {
      userId: user.id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      profilePhoto: user.profilePhoto || "/images/user/default-user.png",
      coverPhoto: user.coverPhoto || "/images/cover/default-cover.png",
      addressTown: user.addressTown || "",
      addressCountry: user.addressCountry || "",
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}