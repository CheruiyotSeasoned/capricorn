"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

export function DepositInstructionsModal({ amount, onSuccess }: { amount: number; onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<"paybill" | "account" | null>(null);

  const handleCopy = (text: string, field: "paybill" | "account") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);

    // Reset after 2 seconds
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };
  return (
    <>
      {/* Deposit Button */}
      <button
  onClick={() => setIsOpen(true)}
  className="w-full py-3 px-4 rounded-lg bg-purple-600 text-white text-lg font-semibold text-center leading-snug hover:bg-purple-700 transition"
>
  Deposit Security Amount
</button>


      {/* Modal */}
      <Dialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  className="relative z-50"
>
  <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-lg space-y-4 dark:bg-gray-900">
      <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
        Deposit Instructions
      </Dialog.Title>

      <p className="text-gray-700 dark:text-gray-300">
        To Claim Your Approved Loan, please deposit the following security amount:
      </p>

      {/* 🟢 Info note */}
      <p className="text-green-700 text-sm bg-green-50 p-2 rounded border border-green-200 dark:bg-green-900/20 dark:text-green-400">
        This security amount helps confirm your intent and will be refunded upon successful repayment of your loan.
      </p>
       <div className="text-2xl font-bold text-green-700 dark:text-green-400">
        Ksh {amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

   <div className="border border-primary/50 rounded-lg bg-white dark:bg-gray-900 p-5 space-y-4 shadow">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Steps
      </h3>

      {/* Instruction text */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        1. Open your M-Pesa app.<br/>
        2. Go to &quot;Lipa na M-Pesa&quot;.<br/>
        3. then select Paybill.<br/>
        Enter the business number and account number below, then enter the amount to deposit.
      </p>

      {/* Paybill */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">Paybill:</p>
          <p className="text-lg font-bold text-primary">123456</p>
        </div>
        <button
          onClick={() => handleCopy("123456", "paybill")}
          className="px-3 py-1 text-xs font-medium border rounded transition border-primary text-primary hover:bg-primary hover:text-white"
        >
          {copiedField === "paybill" ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Account No */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">Account No:</p>
          <p className="text-lg font-bold text-primary">Account Number</p>
        </div>
        <button
          onClick={() => handleCopy("Account Number", "account")}
          className="px-3 py-1 text-xs font-medium border rounded transition border-primary text-primary hover:bg-primary hover:text-white"
        >
          {copiedField === "account" ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Note */}
      
    </div>


      <button
        onClick={() => setIsOpen(false)}
        className="w-full mt-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition"
      >
        Close
      </button>
    </Dialog.Panel>
  </div>
</Dialog>

    </>
  );
}
