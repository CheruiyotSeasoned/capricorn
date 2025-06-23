"use client";

import { DepositInstructionsModal } from "@/components/DepositInstructionsModal";
import { useState } from "react";

export function LoanProgressPanel({
  status,
  appliedAmount,
  onSuccess,
}: {
  status: string;
  appliedAmount: number;
  onSuccess?: () => void;
}) {
  const depositAmount = appliedAmount * 0.30;
  const [step, setStep] = useState(mapStatusToStep(status));
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
    if (onSuccess) onSuccess(); // optional callback
  };

  const nextAction = () => {
    switch (status) {
      case "approved":
      case "deposit_pending":
        return (
          <DepositInstructionsModal
            amount={depositAmount}
            onSuccess={refresh}
            key={refreshKey}
          />
        );

      case "deposit_received":
        return (
          <button className="w-full bg-green-600 text-white hover:bg-green-700">
            Withdraw Funds
          </button>
        );

      case "rejected":
        return (
          <button className="w-full bg-primary text-white hover:bg-primary/90">
            Apply Again
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 w-full rounded-lg border bg-white p-5 shadow-md dark:bg-gray-900 mt-6 space-y-4">
      {/* Step Bar */}
      <StepProgressBar currentStep={step} />

      {/* Status */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border rounded">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Loan Status:
        </p>
        <p className={`text-md font-bold ${getStatusColor(status)}`}>
          {getStatusLabel(status)}
        </p>
      </div>

      {/* Next Action */}
      <div className="w-full flex flex-col space-y-2">{nextAction()}</div>
    </div>
  );
}

function StepProgressBar({ currentStep }: { currentStep: number }) {
  const steps = ["Apply", "Approved", "Deposit", "Withdraw"];
  return (
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center
            ${
              index < currentStep
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {index + 1}
          </div>
          <p className="mt-2 text-xs text-center text-gray-700 dark:text-gray-300">
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}

function getStatusLabel(status: string) {
  return (
    {
      pending: "Waiting Approval",
      approved: "Approved - Deposit Required",
      deposit_pending: "Deposit In Progress",
      deposit_received: "Deposit Received",
      disbursed: "Funds Disbursed",
      rejected: "Application Rejected",
    }[status] || "Unknown"
  );
}

function getStatusColor(status: string) {
  return (
    {
      pending: "text-yellow-600",
      approved: "text-blue-600",
      deposit_pending: "text-blue-600",
      deposit_received: "text-green-600",
      disbursed: "text-green-700",
      rejected: "text-red-600",
    }[status] || "text-gray-600"
  );
}

function mapStatusToStep(status: string): number {
  switch (status) {
    case "pending":
      return 1;
    case "approved":
      return 2;
    case "deposit_pending":
      return 3;
    case "deposit_received":
      return 3; // or 4 if funds ready
    case "disbursed":
      return 4;
    default:
      return 0;
  }
}
