import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactUs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#171512] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Center content */}
        <div className="flex flex-1 justify-center items-center px-4 py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[512px] py-5">
            <div className="flex justify-between gap-3 p-4">
              <p className="text-white text-[32px] font-bold leading-tight">
                Contact Us
              </p>
            </div>

            {/* Name */}
            <div className="flex flex-wrap gap-4 px-4 py-3">
              <label className="flex flex-col w-full">
                <input
                  placeholder="Your Name"
                  className="form-input w-full rounded-xl text-white bg-[#36332b] h-14 placeholder:text-[#b5afa1] p-4 text-base leading-normal focus:outline-none border-none"
                />
              </label>
            </div>

            {/* Email */}
            <div className="flex flex-wrap gap-4 px-4 py-3">
              <label className="flex flex-col w-full">
                <input
                  placeholder="Your Email"
                  className="form-input w-full rounded-xl text-white bg-[#36332b] h-14 placeholder:text-[#b5afa1] p-4 text-base leading-normal focus:outline-none border-none"
                />
              </label>
            </div>

            {/* Subject */}
            <div className="flex flex-wrap gap-4 px-4 py-3">
              <label className="flex flex-col w-full">
                <input
                  placeholder="Subject"
                  className="form-input w-full rounded-xl text-white bg-[#36332b] h-14 placeholder:text-[#b5afa1] p-4 text-base leading-normal focus:outline-none border-none"
                />
              </label>
            </div>

            {/* Message */}
            <div className="flex flex-wrap gap-4 px-4 py-3">
              <label className="flex flex-col w-full">
                <textarea
                  placeholder="Your Message"
                  className="form-input w-full rounded-xl text-white bg-[#36332b] min-h-36 placeholder:text-[#b5afa1] p-4 text-base leading-normal focus:outline-none border-none resize-none"
                ></textarea>
              </label>
            </div>

            {/* Button */}
            <div className="flex px-4 py-3 justify-end">
              <button className="min-w-[84px] h-10 px-4 bg-[#f3e8cc] text-[#171512] rounded-xl font-bold text-sm">
                <span className="truncate">Send Message</span>
              </button>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  );
}
