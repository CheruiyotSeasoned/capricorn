// app/components/EstimateLoan.tsx

"use client";

import { useState } from "react";
import { LoanApplyModal } from "@/components/LoanApplyModal";

export default function EstimateLoan() {
  const [amount, setAmount] = useState(10000); // default Ksh 10,000
  const [months, setMonths] = useState(6); // default 6 months

  const fee = 1250;
  const securityDeposit = amount * 0.30;
  const totalPayable = amount + fee + securityDeposit;
  const monthlyInstallment = totalPayable / months;

  return (
    <div className="max-w-sm mx-auto my-8 p-6 rounded-xl bg-purple-50 border border-purple-200 shadow-lg">
      <h2 className="text-center text-2xl font-bold text-purple-800 mb-4">Estimate Loan</h2>

      {/* Loan Type */}
      <div className="flex justify-center gap-2 mb-4">
        <button className="px-3 py-1 rounded-full bg-purple-600 text-white text-sm font-medium">Personal</button>
        <button className="px-3 py-1 rounded-full border border-purple-300 text-purple-600 text-sm">Business</button>
        <button className="px-3 py-1 rounded-full border border-purple-300 text-purple-600 text-sm">Emergency</button>
      </div>

      {/* Loan Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">Select amount you need</label>
        <input
          type="range"
          min={1000}
          max={100000}
          step={500}
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-center text-xl font-bold text-purple-700 mt-2">
          Ksh {amount.toLocaleString()}
        </div>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">Duration (months)</label>
        <input
          type="range"
          min={1}
          max={24}
          value={months}
          onChange={(e) => setMonths(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-center text-lg text-purple-700 mt-2">
          {months} month{months > 1 ? "s" : ""}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Processing Fee</span>
          <span className="text-sm font-semibold text-purple-700">Ksh {fee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Security Deposit (12%)</span>
          <span className="text-sm font-semibold text-purple-700">Ksh {securityDeposit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Total Payable</span>
          <span className="text-sm font-semibold text-purple-700">Ksh {totalPayable.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Installment</span>
          <span className="text-sm font-semibold text-purple-700">Ksh {monthlyInstallment.toFixed(2)} x {months}</span>
        </div>
      </div>

      {/* Apply Button */}
      <div>
  {/* <button>Apply Now</button> */}
  <LoanApplyModal />
</div>


    </div>
  );
}
