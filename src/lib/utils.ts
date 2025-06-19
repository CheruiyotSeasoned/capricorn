import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function verifyJwt(token: string): Promise<any> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return ('JWT_SECRET is not defined');
    }
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}