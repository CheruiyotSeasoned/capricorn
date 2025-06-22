import Signin from "@/components/Auth/Signin";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-4xl rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card overflow-hidden">
        <div className="w-full xl:w-1/2 p-6 sm:p-12">
          <Signin />
        </div>

        <div className="hidden xl:flex w-1/2 p-12 custom-gradient-1 items-center justify-center">
          {/* Content */}
          <div>
            <Link className="mb-10 inline-block" href="/">
              <Image
                className="hidden dark:block"
                src={"/images/logo/logo.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
              <Image
                className="dark:hidden"
                src={"/images/logo/logo-dark.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
            </Link>

            <p className="mb-3 text-xl font-medium text-dark dark:text-white">
              Sign in to your account
            </p>

            <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white">
              Welcome Back!
            </h1>

            <p className="max-w-xs text-dark-4 dark:text-dark-6">
              Please sign in to your account by completing the necessary fields below
            </p>

            <div className="mt-8">
              <Image
                src={"/images/grids/grid-02.svg"}
                alt="Illustration"
                width={405}
                height={325}
                className="mx-auto dark:opacity-30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

