"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function RegisterWithPassword() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    nationalId: "",
    phoneNumber: "",
    addressCounty: "",
    addressTown: "",
    emergencyName: "",
    emergencyPhone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
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
      toast.success("Registered successfully! Redirecting...");
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 1500);
    } else {
      const result = await res.json();
      toast.error(result.error || "Registration failed");
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
        value={form.fullName}
      />

      <InputGroup
        type="text"
        label="National ID"
        placeholder="12345678"
        name="nationalId"
        onChange={handleChange}
        value={form.nationalId}
      />

      <InputGroup
        type="text"
        label="Mpesa Phone Number"
        placeholder="0712345678"
        name="phoneNumber"
        onChange={handleChange}
        value={form.phoneNumber}
      />

      <div className="grid grid-cols-2 gap-4">
        <InputGroup
          type="text"
          label="County"
          placeholder="Nairobi"
          name="addressCounty"
          onChange={handleChange}
          value={form.addressCounty}
        />

        <InputGroup
          type="text"
          label="Town"
          placeholder="Westlands"
          name="addressTown"
          onChange={handleChange}
          value={form.addressTown}
        />
      </div>

      <InputGroup
        type="text"
        label="Emergency Contact Name"
        placeholder="Jane Doe"
        name="emergencyName"
        onChange={handleChange}
        value={form.emergencyName}
      />

      <InputGroup
        type="text"
        label="Emergency Contact Phone"
        placeholder="0798765432"
        name="emergencyPhone"
        onChange={handleChange}
        value={form.emergencyPhone}
      />

      <InputGroup
        type="email"
        label="Email"
        placeholder="Enter your email"
        name="email"
        onChange={handleChange}
        value={form.email}
        icon={<EmailIcon />}
      />

      <div>
        <InputGroup
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Create a password"
          name="password"
          onChange={handleChange}
          value={form.password}
          icon={<PasswordIcon />}
        />
        <div className="text-sm text-gray-500 mt-1">
          Password must be at least 8 characters, include a number and a capital letter.
        </div>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-sm text-primary mt-1"
        >
          {showPassword ? "Hide Password" : "Show Password"}
        </button>
      </div>

      <div>
        <InputGroup
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm Password"
          placeholder="Confirm your password"
          name="confirmPassword"
          onChange={handleChange}
          value={form.confirmPassword}
          icon={<PasswordIcon />}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="text-sm text-primary mt-1"
        >
          {showConfirmPassword ? "Hide Password" : "Show Password"}
        </button>
      </div>

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
