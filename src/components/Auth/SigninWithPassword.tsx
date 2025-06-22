"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import toast from "react-hot-toast";

export default function SigninWithPassword() {
  const [data, setData] = useState({
    nationalId: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setLoading(true);

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nationalId: data.nationalId,
      password: data.password,
    }),
  });

  setLoading(false);

  if (res.ok) {
    // Optional: Save token, or redirect user
    const result = await res.json();
    // localStorage.setItem("token", result.token);
    // Save token to localStorage
    localStorage.setItem("token", result.token);
    document.cookie = `token=${result.token}; path=/;`;
    // Redirect to dashboard or home
    window.location.href = "/";
  } else {
    toast.error("Login failed! Please check your credentials.");
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="number"
        label="National ID"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your national ID"
        name="nationalId"
        onChange={handleChange}
        handleChange={handleChange}
        value={data.nationalId}  // ✅ correct binding
        icon={<EmailIcon />}
      />


      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        onChange={handleChange}
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
