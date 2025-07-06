import React, { useState } from "react";
import Header from "../components/Header";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#181611] overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Hero Section */}
      <section className="relative min-h-[480px] flex items-center justify-center px-4 py-10 text-center overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/32384-392248811_small.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 text-white flex flex-col items-center gap-4 px-4">
          <h1 className="text-3xl sm:text-5xl font-black">Welcome to ZC Chess Club</h1>
          <p className="text-sm sm:text-base max-w-xl">
            Manage and participate in chess tournaments with ease. Join our community of chess enthusiasts today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/signup">
              <button className="h-10 sm:h-12 px-5 rounded-full bg-[#f3c144] text-[#181611] font-bold">Sign Up</button>
            </a>
            <button className="h-10 sm:h-12 px-5 rounded-full bg-[#393428] text-white font-bold">Explore Tournaments</button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="px-4 sm:px-10 py-8">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">News and Announcements</h2>
        <div className="bg-[#27241b] rounded-xl flex flex-col sm:flex-row overflow-hidden">
            <div
            className="aspect-video sm:w-1/2 bg-cover bg-center"
            style={{
                backgroundImage: 'url("/Tournament1.png")',
                }}
            ></div>

          <div className="p-4 sm:p-6 text-white flex flex-col justify-between sm:w-1/2">
            <p className="text-lg font-bold">Upcoming Chess Tournament</p>
            <p className="text-[#bab19c] my-2">
              Join our annual chess tournament on July 15th. Register now to compete for the grand prize!
            </p>
            <button className="self-start h-8 px-4 rounded-full bg-[#f3c144] text-[#181611] font-medium">
              Register Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
