// app/layout.tsx
import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: {
    template: "Loan APP",
    default: "Personal Loan Dashboard",
  },
  description:
    "Loan dashboard built with Next.js, Tailwind CSS, and TypeScript. It features a modern design, responsive layout, and various components for managing personal loans.",
};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      // Redirect to login if no token
      window.location.href = "/auth/sign-in";
    }
  }

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
