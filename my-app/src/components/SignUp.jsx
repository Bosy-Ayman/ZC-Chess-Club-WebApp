import React, { useState } from "react";
import Header from "../components/Header";

export default function SignUp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#171512]"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      {/* Header on top */}
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Signup form centered below header */}
      <div className="flex flex-grow items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm bg-[#1f1d18] p-6 rounded-2xl shadow-lg">
          <h2 className="text-white text-2xl font-bold text-center mb-6">
            Create Your Account
          </h2>

          {/* Input Fields */}
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-xl bg-[#36332b] text-white p-4 placeholder:text-[#b5afa1] text-sm focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl bg-[#36332b] text-white p-4 placeholder:text-[#b5afa1] text-sm focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl bg-[#36332b] text-white p-4 placeholder:text-[#b5afa1] text-sm focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-xl bg-[#36332b] text-white p-4 placeholder:text-[#b5afa1] text-sm focus:outline-none"
            />

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full h-12 bg-[#f3e8cc] text-[#171512] font-bold rounded-xl hover:opacity-90 transition"
            >
              Sign Up
            </button>
          </form>

          {/* Footer */}
          <p className="text-[#b5afa1] text-sm text-center mt-4 underline cursor-pointer">
            Already have an account? Log in
          </p>
        </div>
      </div>
    </div>
  );
}
