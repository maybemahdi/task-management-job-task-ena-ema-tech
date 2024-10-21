"use client";
import Loading from "@/Components/Loading";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [extraLoading, setExtraLoading] = useState(true);
  const { status } = useSession();

  useEffect(() => {
    document.title = "Task Manager | Login";
  }, [status]);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (status === "authenticated") {
      router.push("/");
    } else {
      setExtraLoading(false);
    }
  }, [status, router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const callbackUrl =
      new URL(window.location.href).searchParams.get("callbackUrl") || "/";
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl,
    });
    console.log(res);
    if (res?.status === 401) {
      setIsLoading(false);
      form.reset();
      return toast.error("Wrong Credentials");
    }
    if (res?.status === 200) {
      toast.success("Login Successful");
      form.reset();
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading || extraLoading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="rounded shadow-md md:w-[30%] w-full mx-auto p-5">
        <h3 className="text-2xl text-center mb-5">Login</h3>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            className="w-full border p-3 rounded"
            placeholder="Enter Your Email"
            required
          />
          <input
            type="password"
            name="password"
            className="w-full border p-3 rounded"
            placeholder="Enter Your Password"
            required
          />
          <p className="text-[10px] ml-1 cursor-pointer">Forget Password?</p>
          <button className="w-full bg-main text-white rounded p-2">
            Login
          </button>
        </form>
        <p className="text-base my-3 text-center">
          New to Task Manager?{" "}
          <span>
            <Link className="text-blue-500 cursor-pointer" href={"/register"}>
              Create an Account
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Page;
