"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { useRouter } from "next/navigation";

export default function RegisterWithPassword() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    nationalId: "",
    phoneNumber: "",
    addressCounty: "",
    addressTown: "",
    loanAmount: "",
    emergencyName: "",
    emergencyPhone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      alert("Registered successfully!");
      router.push("/sign-in");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputGroup
        type="text"
        label="Full Name"
        placeholder="John Doe"
        name="fullName"
        onChange={handleChange}
        handleChange={handleChange}
        value={form.fullName}
      />

      <InputGroup
        type="text"
        label="National ID"
        placeholder="12345678"
        name="nationalId"
        onChange={handleChange}
        handleChange={handleChange}
        value={form.nationalId}
      />

      <InputGroup
        type="text"
        label="Mpesa Phone Number"
        placeholder="0712345678"
        name="phoneNumber"
        onChange={handleChange}
        handleChange={handleChange}
        value={form.phoneNumber}
      />

      <div className="grid grid-cols-2 gap-4">
        <InputGroup
          type="text"
          label="County"
          placeholder="Nairobi"
          name="addressCounty"
          onChange={handleChange}
          handleChange={handleChange}
          value={form.addressCounty}
        />

        <InputGroup
          type="text"
          label="Town"
          placeholder="Westlands"
          name="addressTown"
          onChange={handleChange}
          handleChange={handleChange}
          value={form.addressTown}
        />
      </div>

      <InputGroup
        type="number"
        label="Loan Amount to Apply"
        placeholder="25000"
        name="loanAmount"
        onChange={handleChange}
        handleChange={handleChange}
        value={form.loanAmount}
      />

      <InputGroup
        type="text"
        label="Emergency Contact Name"
        placeholder="Jane Doe"
        name="emergencyName"
        onChange={handleChange}
        handleChange={handleChange}
        value={form.emergencyName}
      />

      <InputGroup
        type="text"
        label="Emergency Contact Phone"
        placeholder="0798765432"
        name="emergencyPhone"
        onChange={handleChange}
        handleChange={handleChange}
        value={form.emergencyPhone}
      />

      <InputGroup
        type="email"
        label="Email"
        placeholder="Enter your email"
        name="email"
        onChange={handleChange}
        handleChange={handleChange}
        value={form.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        placeholder="Create a password"
        name="password"
        onChange={handleChange}
        handleChange={handleChange}
        value={form.password}
        icon={<PasswordIcon />}
      />

      <InputGroup
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        name="confirmPassword"
        onChange={handleChange}
        handleChange={handleChange}
        value={form.confirmPassword}
        icon={<PasswordIcon />}
      />

      <button
        type="submit"
        className="w-full bg-primary text-white font-semibold py-3 rounded-lg text-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
            Registering...
          </>
        ) : (
          "Register"
        )}
      </button>

    </form>
  );
}
