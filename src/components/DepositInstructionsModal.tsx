"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

export function DepositInstructionsModal({ amount }: { amount: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Deposit Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 rounded-lg bg-purple-600 text-white text-lg font-semibold hover:bg-purple-700 transition"
      >
        Deposit
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
              To proceed with your loan application, please deposit the following security amount:
            </p>

            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              Ksh {amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Paybill: <strong>123456</strong></p>
              <p>Account No: <strong>Your Phone Number</strong></p>
              <p>Bank Option: <strong>ABC Bank 123-456-7890</strong></p>
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
