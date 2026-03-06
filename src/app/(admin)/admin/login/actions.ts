"use server";
import { cookies } from "next/headers";

export async function loginAction(password: string) {
  // Fallback to string if .env is not being read correctly by your OS
  const correctPassword = process.env.ADMIN_PASSWORD || "Portfolio-Rafay";

  if (password === correctPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authorized", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return { success: true };
  }
  return { success: false };
}