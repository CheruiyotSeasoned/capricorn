import Link from "next/link";
// import GoogleSigninButton from "../GoogleSigninButton";
import RegisterWithPassword from "../RegisterWithPassword";

export default function Register() {
  return (
    <>
      {/* <GoogleSigninButton text="Sign up" /> */}

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Welcome to Capricorn Registration
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <RegisterWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
