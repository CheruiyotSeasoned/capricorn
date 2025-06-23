"use client";

import { useEffect, useState } from "react";
import { getLoanOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import Image from "next/image";
import { DepositInstructionsModal } from "@/components/DepositInstructionsModal";
import { LoanApplyModal } from "@/components/LoanApplyModal";
import { LoanProgressPanel } from "@/components/LoanProgressPanel";

type Loan = {
  appliedAmount: number;
  qualifiedAmount: number;
  securityAmount: number;
  status: "pending" | "approved" | "rejected";
};

type UserProfile = {
  fullName: string;
  phoneNumber: string;
  profilePhoto: string;
  coverPhoto: string;
  loans: Loan[];
};

export function OverviewCardsGroup() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/auth/sign-in";
      return;
    }

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
            loans: result.data.loans || [],
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, [refreshKey]);

  if (!profile) return <div>Loading...</div>;

  // Totals
  const totalApplied = profile.loans?.reduce(
    (sum, loan) => sum + loan.appliedAmount,
    0
  );

  const totalQualified = profile.loans?.reduce(
    (sum, loan) => sum + loan.qualifiedAmount,
    0
  );

  const totalSecurity = profile.loans?.reduce(
    (sum, loan) => sum + loan.securityAmount,
    0
  );

  // Progress panel: use most recent approved loan (if exists)
  const latestApprovedLoan = profile.loans?.[0] || {
    appliedAmount: 0,
    qualifiedAmount: 0,
    securityAmount: 0,
    status: "pending",
  };

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">

      {/* Profile Card */}
      <div className="sm:col-span-2 rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900">
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
            backgroundImage: `url(${profile.coverPhoto})`,
          }}
        ></div>

        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start -mt-12 space-y-4 sm:space-y-0 sm:space-x-4 px-4">
          <Image
            src={profile.profilePhoto}
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
            status={latestApprovedLoan.status}
            appliedAmount={latestApprovedLoan.appliedAmount}
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
                Ksh {totalQualified.toLocaleString("en-KE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* Bank Account */}
            <div className="mt-4 p-3 bg-gray-50 border rounded shadow-sm">
              <p className="text-sm text-gray-400 mb-1">Your Account Number</p>
              <p className="text-md font-semibold text-gray-700">12345</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Deposit */}
      <OverviewCard
        label="Security Deposit Amount"
        data={{
          value:
            "Ksh " +
            totalSecurity.toLocaleString("en-KE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          growthRate: 0,
        }}
        Icon={icons.Product}
        action={
          <div className="flex flex-col space-y-2">
            <LoanApplyModal onSuccess={refresh} />
            {latestApprovedLoan.appliedAmount > 0 &&
              latestApprovedLoan.status === "pending" && (
                <DepositInstructionsModal
                  amount={latestApprovedLoan.appliedAmount * 0.12}
                  onSuccess={refresh}
                />
              )}
          </div>
        }
      />

      {/* Applied Amount */}
{/* Applied Amount */}
<OverviewCard
  label="Applied Amount"
  data={{
    value:
      "Ksh " +
      totalApplied.toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    growthRate: 0,
  }}
  
  action={
    <div className="flex space-x-6 items-center mt-4">
  <div className="h-20 w-36 relative rounded-lg bg-white p-2 shadow-sm transform transition-transform hover:scale-105">
    <Image
      src="/images/logo/im-logo.png"
      alt="I&M Bank"
      fill
      className="object-contain"
    />
  </div>
  <div className="h-20 w-36 relative rounded-lg bg-white p-2 shadow-sm transform transition-transform hover:scale-105">
    <Image
      src="/images/logo/mpesa-logo.png"
      alt="M-Pesa"
      fill
      className="object-contain"
    />
  </div>
</div>

  }
/>


    </div>
  );
}
