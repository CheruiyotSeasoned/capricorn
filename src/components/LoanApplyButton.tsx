"use client";

import { toast } from "sonner";

export function LoanApplyButton() {
  const applyForLoan = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to apply for a loan.");
        return;
      }

      const res = await fetch("/api/loans/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appliedAmount: 25000, // Example amount
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Loan application submitted!");
      } else {
        toast.error(result.error || "Failed to apply for loan.");
      }
    } catch (err) {
      toast.error("Server error.");
      console.error(err);
    }
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={applyForLoan}
        className="rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 transition"
      >
        Apply for Loan
      </button>
    </div>
  );
}
