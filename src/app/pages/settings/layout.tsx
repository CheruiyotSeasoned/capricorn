import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import type { PropsWithChildren } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Page",
};

export default function ProfileLayout({ children }: PropsWithChildren) {
  // Check for token (this runs on client)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if no token
      window.location.href = "/auth/sign-in";
      return null; // Prevent rendering profile page
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header />
        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
