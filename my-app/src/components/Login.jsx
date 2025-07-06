import React, { useState } from "react";
import Header from "../components/Header";

export default function LoginPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#171512] px-4"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      {/* Header on top */}
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Centered login form */}
      <div className="flex flex-grow items-center justify-center">
        <div className="w-full max-w-sm bg-[#1f1d18] p-6 rounded-2xl shadow-lg mt-10">
          <header className="text-center mb-6">
            <h2 className="text-white text-2xl font-bold">Welcome Back</h2>
            <p className="text-[#b5afa1] text-sm mt-1">Log in to your Chess Club account</p>
          </header>

          <form className="flex flex-col gap-4">
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

            <p className="text-right text-sm text-[#b5afa1] underline cursor-pointer">
              Forgot password?
            </p>

            <button
              type="submit"
              className="bg-[#f3e8cc] text-[#171512] font-bold py-3 rounded-xl hover:opacity-90 transition"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-[#b5afa1] mt-4">
            Don't have an account? <span className="underline cursor-pointer">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
