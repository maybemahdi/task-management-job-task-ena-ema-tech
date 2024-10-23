/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

// react icons
import { CiMenuFries } from "react-icons/ci";
import useRouting from "@/Hooks/useRouting";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

const NavBar = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const goRoute = useRouting();
  const { status } = useSession();

  return (
    <nav className="flex items-center justify-between w-full relative bg-white boxShadow rounded-full px-[10px] py-[16px]">
      <p
        onClick={() => goRoute("/")}
        className="before:w-0 hover:before:w-full before:bg-main before:h-[2px] before:transition-all before:duration-300 before:absolute relative before:rounded-full before:bottom-[-2px]  transition-all duration-300 before:left-0 cursor-pointer capitalize"
      >
        <span className="text-main font-bold text-lg">Task</span> Manager
      </p>

      <div className="items-center gap-[10px] flex">
        {status !== "loading" && status === "authenticated" ? (
          <button
            onClick={() => {
              signOut();
              toast.success("Sign Out Successful");
            }}
            className="py-[7px] text-[1rem] px-[16px] rounded-full capitalize bg-main text-white hover:bg-blue-600 transition-all duration-300 sm:flex hidden"
          >
            Log out
          </button>
        ) : (
          <button
            onClick={() => goRoute("/login")}
            className="py-[7px] text-[1rem] px-[16px] rounded-full capitalize bg-main text-white hover:bg-blue-600 transition-all duration-300 sm:flex hidden"
          >
            Sign in
          </button>
        )}

        {!mobileSidebarOpen ? (
          <CiMenuFries
            className="text-[1.8rem] mr-1 text-[#424242]c cursor-pointer lg:hidden flex"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />
        ) : (
          <RxCross2
            className="text-[1.8rem] mr-1 text-[#424242]c cursor-pointer lg:hidden flex"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />
        )}
      </div>

      <aside
        className={` ${
          mobileSidebarOpen
            ? "translate-x-0 opacity-100 z-20"
            : "translate-x-[-200px] opacity-0 z-[-1]"
        } lg:hidden bg-white boxShadow p-4 text-center absolute top-[65px] right-0 w-full rounded-md transition-all duration-300`}
      >
        <div className="items-center gap-[10px] flex flex-col">
          {status !== "loading" && status === "authenticated" ? (
            <button
              onClick={() => {
                signOut();
                toast.success("Sign Out Successful");
              }}
              className="py-[7px] text-[1rem] px-[16px] rounded-full capitalize bg-main text-white hover:bg-blue-600 transition-all duration-300"
            >
              Log out
            </button>
          ) : (
            <button
              onClick={() => goRoute("/login")}
              className="py-[7px] text-[1rem] px-[16px] rounded-full capitalize bg-main text-white hover:bg-blue-600 transition-all duration-300"
            >
              Sign in
            </button>
          )}
        </div>
      </aside>
    </nav>
  );
};

export default NavBar;
