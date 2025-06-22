"use client";

import { useEffect, useState } from "react";
import { compactFormat } from "@/lib/format-number";
import { getLoanOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import Image from "next/image";
import { DepositInstructionsModal } from "@/components/DepositInstructionsModal";
import { Wallet } from "@/app/profile/_components/icons";
import { OverviewCardsSkeleton } from "./skeleton";
import { LoanApplyModal } from "@/components/LoanApplyModal";
import { LoanProgressPanel } from "@/components/LoanProgressPanel";

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

type UserProfile = {
  fullName: string;
  phoneNumber: string;
  profilePhoto: string;
  coverPhoto: string;
};

export function OverviewCardsGroup() {
  const [loanData, setLoanData] = useState<LoanOverview | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if no token
      window.location.href = "/auth/sign-in";
      return;
    }

    // Fetch loan overview
    getLoanOverviewData(token)
      .then((res) => setLoanData(res.data))
      .catch((err) => console.error("Loan overview error:", err));

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile/details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        console.log("Profile GET result:", result);

        if (result.success && result.data) {
          setProfile({
            fullName: result.data.fullName,
            phoneNumber: result.data.phoneNumber,
            profilePhoto:
              result.data.profilePhotoUrl || "/images/user/default-user.png",
            coverPhoto:
              result.data.coverPhotoUrl || "/images/cover/default-cover.png",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, [setLoanData, setProfile]);

  if (!loanData || !profile) return <div>Loading...</div>;

  const {
    totalLoanAmount,
    outstandingBalance,
    totalPaid,
    nextDueDate,
    latestLoan,
  } = loanData;

  const remainingQualified =
    latestLoan.qualifiedAmount - latestLoan.appliedAmount;

  return (
<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
  {/* User Profile Card */}
  
 <div className="sm:col-span-2 rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900">

  {/* Fancy Text Logo + Info */}
  <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
    <div>
      <h1 className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-wide">
        CAPRICORN CREDIT
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
        Fast, affordable credit
      </p>
    </div>
  </div>

  {/* Cover Photo */}
  <div
    className="h-24 w-full rounded-lg bg-cover bg-center"
    style={{
      backgroundImage: `url(${profile.coverPhoto || '/images/cover/default-cover.png'})`,
    }}
  ></div>

  {/* Profile Section */}
  <div className="flex flex-col sm:flex-row items-center sm:items-start -mt-12 space-y-4 sm:space-y-0 sm:space-x-4 px-4">
    <Image
  src={profile.profilePhoto || '/images/user/user-15.png'}
  alt="Profile"
  width={96}
  height={96}
  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
/>
    <div className="flex-1 text-center sm:text-left">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{profile.fullName}</h3>
      <p className="text-sm text-gray-500 mb-2">{profile.phoneNumber}</p>
</div>
<LoanProgressPanel
  status={latestLoan.status}
  appliedAmount={latestLoan.appliedAmount}
/>

    <div className="flex-1 text-center sm:text-left">
      {/* Approved Loan Amount */}
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
        <p className="text-sm text-green-700 mb-1 flex items-center">
          <svg
            className="h-4 w-4 mr-1 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8.364 8.364a1 1 0 01-1.414 0L3.293 11.414a1 1 0 011.414-1.414l3.95 3.95 7.657-7.657a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Approved Loan Amount
        </p>
        <p className="text-2xl font-bold text-green-800">
          Ksh {(latestLoan?.qualifiedAmount || 0).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Dummy Bank Account */}
      <div className="mt-4 p-3 bg-gray-50 border rounded shadow-sm">
        <p className="text-sm text-gray-400 mb-1">Your Account Number</p>
        <p className="text-md font-semibold text-gray-700">
          12345
        </p>
      </div>

    </div>
  </div>
</div>




      {/* Qualified Loan Amount Card */}
{/* Qualified Loan Amount Card */}
<OverviewCard
  label="Security Deposit Amount"
  data={{
    value:
      "Ksh " +
      (latestLoan.appliedAmount * 0.12).toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    growthRate: 0,
  }}
  Icon={icons.Product}
  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  action={
  <div className="flex flex-col space-y-2">
    {/* Apply Now button */}
    <LoanApplyModal />

    {/* Show Deposit button only if appliedAmount > 0 and status is pending */}
    {latestLoan?.appliedAmount > 0 && latestLoan?.status === "pending" && (
  <DepositInstructionsModal amount={latestLoan.appliedAmount * 0.12} />
  )}

  </div>
}

/>


      {/* Applied Amount */}
      <OverviewCard
        label="Applied Amount"
        data={{
          value: "Ksh " + (latestLoan.appliedAmount).toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
          growthRate: 0,
        }}
        Icon={icons.Profit} // or another valid icon
      />

      {/* Remaining Qualified */}
      {/* <OverviewCard
        label="Remaining Qualified"
        data={{
          value: "Ksh " + compactFormat(remainingQualified),
          growthRate: 0,
        }}
        Icon={icons.Product}
      /> */}

      {/* Application Status */}
      {/* <OverviewCard
        label="Application Status"
        data={{
          value: latestLoan.status.charAt(0).toUpperCase() + latestLoan.status.slice(1),
          growthRate: 0,
        }}
        Icon={ icons.Approved}
      /> */}

      {/* Allocated or Rejected Amount */}
      {/* {latestLoan.status !== "pending" && (
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
      )} */}
    </div>
  );
}
