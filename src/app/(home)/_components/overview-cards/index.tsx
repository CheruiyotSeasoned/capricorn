"use client";

import { useEffect, useState } from "react";
import { compactFormat } from "@/lib/format-number";
import { getLoanOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { LoanApplyModal } from "@/components/LoanApplyModal";

type LoanOverview = {
  totalLoanAmount: { value: number };
  outstandingBalance: { value: number };
  totalPaid: { value: number };
  nextDueDate: { value: string | null };
  latestLoan: {
    appliedAmount: number;
    qualifiedAmount: number;
    securityAmount: number;
    status: "pending" | "approved" | "rejected";
  };
};

export function OverviewCardsGroup() {
  const [data, setData] = useState<LoanOverview | null>(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  console.log("Token:", token);

  if (!token) {
    // Redirect to login if no token
    window.location.href = "/auth/sign-in";
    return; // Prevent further execution
  }

  // Fetch loan overview
  getLoanOverviewData(token)
    .then((res) => setData(res.data))
    .catch((err) => console.error(err));

}, []);


  if (!data) return <div>Loading...</div>;

  const {
    totalLoanAmount,
    outstandingBalance,
    totalPaid,
    nextDueDate,
    latestLoan,
  } = data;

  const remainingQualified =
    latestLoan.qualifiedAmount - latestLoan.appliedAmount;

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {/* Qualified Loan Amount */}
      <OverviewCard
        label="Qualified Loan Amount"
        data={{
          value: "Ksh " + compactFormat(latestLoan.qualifiedAmount),
          growthRate: 0,
        }}
        Icon={icons.Profit}
        className="col-span-2 bg-primary/20 text-primary dark:bg-primary/10 dark:text-primary"
        action={<LoanApplyModal />}
      />

      {/* Applied Amount */}
      <OverviewCard
        label="Applied Amount"
        data={{
          value: "Ksh " + compactFormat(latestLoan.appliedAmount),
          growthRate: 0,
        }}
        Icon={icons.Profit} // or another valid icon
      />

      {/* Remaining Qualified */}
      <OverviewCard
        label="Remaining Qualified"
        data={{
          value: "Ksh " + compactFormat(remainingQualified),
          growthRate: 0,
        }}
        Icon={icons.Product}
      />

      {/* Application Status */}
      <OverviewCard
        label="Application Status"
        data={{
          value: latestLoan.status.charAt(0).toUpperCase() + latestLoan.status.slice(1),
          growthRate: 0,
        }}
        Icon={ icons.Approved}
      />

      {/* Allocated or Rejected Amount */}
      {latestLoan.status !== "pending" && (
        <OverviewCard
          label={
            latestLoan.status === "approved"
              ? "Allocated Amount"
              : "Rejected Amount"
          }
          data={{
            value:
              "Ksh " +
              compactFormat(
                latestLoan.status === "approved"
                  ? latestLoan.appliedAmount
                  : latestLoan.qualifiedAmount
              ),
            growthRate: 0,
          }}
          Icon={ icons.Approved}
          className="sm:col-span-2"
        />
      )}
    </div>
  );
}
