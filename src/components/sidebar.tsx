"use client";
import React from "react";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  links: { name: string; icon: string; path: string }[];
}


const Sidebar: React.FC<SidebarProps> = ({ links }) => {
  const location = useLocation();

  return (
    <div className="h-screen w-96 bg-[#FBFBFB] text-[#2A2A29] sm:flex justify-between flex-col pt-20 hidden">

      <div className="p-4 text-lg font-bold  border-gray-700 text-[#A73636]">
        Payfixy Pay-Multi
      </div>
      <p className="text-[#2A2A29] px-4 text-sm leading-6 font-medium tracking-[-1%]">
        Pay-Multi lets users make a single payment for multiple government application fees across different service portals. 
         </p>
      <nav className="flex-1 mt-9 space-y-2 px-4 w-[300px]">
        {links.map((link, index) => {
            // const isActive = location.pathname === link.path || 
            //        (link.path === '/transaction-references' && 
            //         (location.pathname.startsWith('/transaction-references/') || 
            //          /^\/[^/]+$/.test(location.pathname))); // matches /:id pattern
        return (
          <a
          key={index}
          href={link.path}
          className={`flex items-center gap-4 px-4 py-2 rounded-lg ${location.pathname === link.path
            ? "bg-[#A73636] text-white"
            : "text-[#2A2A29] hover:bg-[#A73636] hover:text-white"
          }`}
          >
            <img
              src={link.icon}
              alt="icons"
              className={location.pathname === link.path ? "brightness-0 invert" : ""}
              />
            <span>{link.name}</span>
          </a>
        )})}
      </nav>

      <div className="p-4 border-gray-700">
        <a
          href="#logout"
          className="flex items-center justify-between gap-4 px-4 py-2 text-gray-300 hover:bg-rd-600 hover:text-white rounded-lg"
        >
          <div className="flex gap-3 items-center">
            <div className="flex items-center justify-center bg-[#D8DAE5] w-8 sm:w-10 h-8 sm:h-10 rounded-full">
              <span className="flex gap-2 text-black">OJ</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#2A2A29]">Omawunmi Joseph</span>
              <span className="text-[#71737E] text-sm leading-[145%] font-normal">
                Omawunmi Joseph
              </span>
            </div>
          </div>
          <img src="/logout.svg" alt="" />
        </a>
        <div className="w-full flex items-center gap-2 px-4">
          <span className="text-[#1A1616] leading-6 font-semibold text-lg tracking-[-1%]">
            Powered by
          </span>
          <img src="/logout-logo.svg" alt="logout" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;