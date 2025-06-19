"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CameraIcon } from "./_components/icons";

interface UserProfile {
  fullName: string;
  phoneNumber: string;
  profilePhoto: string;
  coverPhoto: string;
}

export default function Page() {
  const [data, setData] = useState<UserProfile>({
    fullName: "",
    phoneNumber: "",
    profilePhoto: "/images/user/default-user.png",
    coverPhoto: "/images/cover/default-cover.png",
  });

useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

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
        setData({
          fullName: result.data.fullName,
          phoneNumber: result.data.phoneNumber,
profilePhoto: result.data.profilePhotoUrl || "/images/user/default-user.png",
coverPhoto: result.data.coverPhotoUrl || "/images/cover/default-cover.png",

          // If you add other fields — you can also update state here
        });
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  fetchProfile();
}, []);


  const handleChange = async (e: any) => {
    const file = e.target?.files?.[0];
    const name = e.target.name;

    if (!file) return;

    const formData = new FormData();
    formData.append("userId", "1"); // Example userId
    formData.append(name, file);

    const res = await fetch("/api/profile/update-photos", {
      method: "POST",
      body: formData,
    });
    console.log(res);
// const text = await res.text();
// console.log(text);

    const result = await res.json();
    console.log(result);

    if (result?.updates) {
      setData({
        ...data,
        ...(name === "profilePhoto" && { profilePhoto: result.updates.profilePhotoUrl }),
        ...(name === "coverPhoto" && { coverPhoto: result.updates.coverPhotoUrl }),
      });
    }
  };

  return (
  <div className="mx-auto w-full max-w-[970px]">
    <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      
      {/* Cover */}
      <div className="relative z-20 h-52 md:h-80">
        <Image
          src={data.coverPhoto}
          alt="profile cover"
          className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
          width={970}
          height={320}
          style={{
            width: "auto",
            height: "auto",
          }}
        />
        <div className="absolute bottom-2 right-2 z-10">
          <label
            htmlFor="coverPhoto"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
          >
            <input
              type="file"
              name="coverPhoto"
              id="coverPhoto"
              className="sr-only"
              onChange={handleChange}
              accept="image/png, image/jpg, image/jpeg"
            />
            <CameraIcon />
            <span>Edit Cover</span>
          </label>
        </div>
      </div>

      {/* Profile */}
      <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
        <div className="relative z-30 mx-auto -mt-16 h-32 w-32 rounded-full bg-white/20 p-1 backdrop-blur sm:h-40 sm:w-40 sm:p-2">
          <div className="relative drop-shadow-2">
            <Image
              src={data.profilePhoto}
              width={160}
              height={160}
              className="overflow-hidden rounded-full"
              alt="profile"
            />
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90"
            >
              <CameraIcon />
              <input
                type="file"
                name="profilePhoto"
                id="profilePhoto"
                className="sr-only"
                onChange={handleChange}
                accept="image/png, image/jpg, image/jpeg"
              />
            </label>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4">
          <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
            {data.fullName || "User Name"}
          </h3>
          <p className="font-medium text-body-sm text-gray-600 dark:text-gray-300">
            Phone: {data.phoneNumber}
          </p>
        </div>

        {/* About */}
        <div className="mx-auto max-w-[720px] mt-6">
          <h4 className="font-medium text-dark dark:text-white">About</h4>
          <p className="mt-4">
            Welcome to your profile. You can update your personal information and manage your loans.
          </p>
        </div>
          {/* Wallet Balance */}
  {/* Wallet Balance */}
  <div className="mt-6">
    <h4 className="font-medium text-dark dark:text-white">Wallet Balance</h4>
    <div className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-6 py-4 text-lg font-semibold text-primary dark:text-white shadow-sm inline-block">
      Ksh 4,500.00
    </div>
  </div>
    <div className="mt-4 flex justify-center gap-4">
    <button
      className="rounded-lg bg-primary px-6 py-2 text-white font-medium hover:bg-primary/90 transition"
      onClick={() => console.log("Deposit clicked")}
    >
      Deposit
    </button>
    <button
      className="rounded-lg bg-secondary px-6 py-2 text-white font-medium hover:bg-secondary/90 transition"
      onClick={() => console.log("Withdraw clicked")}
    >
      Withdraw
    </button>
  </div>

  {/* Loan Summary */}
  <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Amount Applied */}
    <div className="rounded-lg bg-blue-100 dark:bg-blue-900 px-6 py-4 text-center">
      <h4 className="text-dark dark:text-white mb-2 font-medium">Amount Applied</h4>
      <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
        Ksh 10,000.00
      </p>
    </div>

    {/* Amount Qualified */}
    <div className="rounded-lg bg-green-100 dark:bg-green-900 px-6 py-4 text-center">
      <h4 className="text-dark dark:text-white mb-2 font-medium">Amount Qualified</h4>
      <p className="text-xl font-bold text-green-700 dark:text-green-300">
        Ksh 15,000.00
      </p>
    </div>

    {/* Security Amount */}
    <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900 px-6 py-4 text-center">
      <h4 className="text-dark dark:text-white mb-2 font-medium">Security Amount</h4>
      <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
        Ksh 3,000.00
      </p>
    </div>
  </div>
      </div>
    </div>
  </div>
);

}
