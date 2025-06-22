"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export function LoanApplyModal({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [applied, setApplied] = useState<number>(0);

  // business logic
  const bonus = 1250;
  const qualified = applied > 0 ? applied + bonus : 0;
  const security = qualified * 0.12;

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please log in first");

    const res = await fetch("/api/loans/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appliedAmount: applied }),
    });
    const json = await res.json();
    if (json.success) {
      toast.success("Loan applied!");
      setIsOpen(false);
    } else {
      toast.error("Error: " + json.error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Apply for Loan
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Apply for a Loan</h2>

            <label className="block mb-2">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Loan Amount (KES)
              </span>
              <input
                type="number"
                min={1}
                value={applied || ""}
                onChange={e => setApplied(Number(e.target.value))}
                className="mt-1 w-full rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                placeholder="e.g. 25000"
              />
            </label>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span>Qualified Amount:</span>
                <span className="font-medium">
                  Ksh {qualified.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit (12%):</span>
                <span className="font-medium">
                  Ksh {security.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={applied <= 0}
                className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50 hover:bg-primary/90"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
