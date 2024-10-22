/* eslint-disable @next/next/no-img-element */
import React from "react";
import { CgFacebook } from "react-icons/cg";
import { BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-white boxShadow rounded-xl w-full p-3 lg:p-4 relative pb-[30px]">
      <div className="w-full flex items-center justify-center pt-[30px] flex-col gap-[10px]">
        <p className="before:w-0 hover:before:w-full before:bg-main before:h-[2px] before:transition-all before:duration-300 before:absolute relative before:rounded-full before:bottom-[-2px]  transition-all duration-300 before:left-0 cursor-pointer capitalize">
          <span className="text-main font-bold text-lg">Task</span> Manager
        </p>
        <div className="flex gap-[15px] text-black mb-2">
          <a className="text-[1.3rem] p-1.5 cursor-pointer rounded-full bg-white text-text boxShadow">
            <CgFacebook />
          </a>
          <a className="text-[1.2rem] p-1.5 cursor-pointer rounded-full bg-white text-text boxShadow">
            <BsTwitter />
          </a>
          <a className="text-[1.2rem] p-1.5 cursor-pointer rounded-full bg-white text-text boxShadow">
            <BsInstagram />
          </a>
          <a className="text-[1.2rem] p-1.5 cursor-pointer rounded-full bg-white text-text boxShadow">
            <BsLinkedin />
          </a>
        </div>
      </div>

      <div className="z-30 px-3 flex items-center justify-center w-full">
        <p className="text-[0.9rem] text-gray-800 text-center">
          © {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
