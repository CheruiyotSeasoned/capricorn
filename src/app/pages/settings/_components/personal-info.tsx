"use client";

import {
  CallIcon,
  EmailIcon,
  UserIcon,
} from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ProfileData = {
  fullName: string;
  phoneNumber: string;
  email: string;
};

export function PersonalInfoForm() {
  const [profile, setProfile] = useState<ProfileData>({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

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
            fullName: result.data.fullName || "",
            phoneNumber: result.data.phoneNumber || "",
            email: result.data.email || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
  <form
    onSubmit={async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth/sign-in";
        return;
      }

      try {
        const res = await fetch("/api/profile/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        });

        const result = await res.json();
        console.log("Update result:", result);

        if (result.success) {
          toast.success("Profile updated successfully");
        } else {
          toast.error("Failed to update profile");
        }
      } catch (err) {
        console.error("Update error:", err);
        toast.error("An error occurred");
      }
    }}
  >
    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
      <InputGroup
        className="w-full sm:w-1/2"
        type="text"
        name="fullName"
        label="Full Name"
        placeholder="Enter your full name"
        value={profile.fullName}
        onChange={(e) =>
          setProfile({ ...profile, fullName: e.target.value })
        }
        icon={<UserIcon />}
        iconPosition="left"
        height="sm"
      />

      <InputGroup
        className="w-full sm:w-1/2"
        type="text"
        name="phoneNumber"
        label="Phone Number"
        placeholder="Enter your phone number"
        value={profile.phoneNumber}
        onChange={(e) =>
          setProfile({ ...profile, phoneNumber: e.target.value })
        }
        icon={<CallIcon />}
        iconPosition="left"
        height="sm"
      />
    </div>

    <InputGroup
      className="mb-5.5"
      type="email"
      name="email"
      label="Email Address"
      placeholder="Enter your email"
      value={profile.email}
      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      icon={<EmailIcon />}
      iconPosition="left"
      height="sm"
    />

    <div className="flex justify-end gap-3">
      <button
        className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
        type="button"
      >
        Cancel
      </button>

      <button
        className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
        type="submit"
      >
        Save
      </button>
    </div>
  </form>
</ShowcaseSection>

  );
}
