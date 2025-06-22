"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import InputGroup from "@/components/FormElements/InputGroup";

export default function ForgotPasswordPage() {
  const [nationalId, setNationalId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nationalId) {
      toast.error("Please enter your National ID");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nationalId }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Password reset link sent (or further instructions)!");
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);
    } else {
      const result = await res.json();
      toast.error(result.error || "Failed to send reset instructions");
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-lg p-8 shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputGroup
          type="text"
          label="Enter your National ID"
          placeholder="12345678"
          name="nationalId"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg text-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>
    </div>
  );
}
