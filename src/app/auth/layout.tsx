import type { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </main>
  );
}