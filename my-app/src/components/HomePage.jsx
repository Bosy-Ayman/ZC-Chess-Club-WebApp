import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./HomePage.css";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="homepage">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Hero Section */}
      <section className="relative min-h-[480px] flex items-center justify-center px-4 py-10 text-center overflow-hidden">
        <video
          className="hero-video"
          src="/32384-392248811_small.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-overlay"></div>

        <div className="hero-content px-4">
          <h1 className="text-3xl sm:text-5xl font-black">Welcome to ZC Chess Club</h1>
          <p className="text-sm sm:text-base max-w-xl">
            Manage and participate in chess tournaments with ease. Join our community of chess enthusiasts today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/signup">
              <button className="h-10 sm:h-12 px-5 rounded-full bg-[#f3c144] text-[#181611] font-bold">
                Sign Up
              </button>
            </a>
            <button className="h-10 sm:h-12 px-5 rounded-full bg-[#393428] text-white font-bold">
              Explore Tournaments
            </button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="px-4 sm:px-10 py-8">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">News and Announcements</h2>
        <div className="bg-[#27241b] rounded-xl flex flex-col sm:flex-row overflow-hidden">
          <div
            className="aspect-video sm:w-1/2 news-image"
            style={{ backgroundImage: 'url("/Tournament1.png")' }}
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

      {/* Winners Section */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Recent Tournament Winners
      </h2>
      <div className="flex justify-center gap-6 flex-wrap p-4">
        {/* Winner 1 */}
        <div className="flex flex-col gap-4 rounded-lg w-80">
          <div
            className="winner-image"
            style={{ backgroundImage: `url("/Winners/Winner1.png")` }}
          ></div>
          <div>
            <p className="text-white text-base font-medium leading-normal">Abdelrahman Mohamed</p>
            <p className="text-[#b5afa1] text-sm">First Place of the Ramadan Tournament</p>
          </div>
        </div>

        {/* Winner 2 */}
        <div className="flex flex-col gap-4 rounded-lg w-80">
          <div
            className="winner-image"
            style={{ backgroundImage: `url("/Winners/Winner2.png")` }}
          ></div>
          <div>
            <p className="text-white text-base font-medium leading-normal">Mazen Ahmed</p>
            <p className="text-[#b5afa1] text-sm">Runner-up in the Ramadan Tournament</p>
          </div>
        </div>

        {/* Winner 3 */}
        <div className="flex flex-col gap-4 rounded-lg w-80">
          <div
            className="winner-image"
            style={{ backgroundImage: `url("/Winners/Winner3.png")` }}
          ></div>
          <div>
            <p className="text-white text-base font-medium leading-normal">Abdelrahman Mane3</p>
            <p className="text-[#b5afa1] text-sm">Third Place in the Ramadan Tournament</p>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Photo Gallery
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {[
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCfh3yv3sB5PLgEzD6y3CVUSu1U-xgLmVdgMejNi_A2xW7EKKWxtf4qNKYoGtJ95LyOBdf8AzhsjN_nKUnNgp5-Bx9kzhf6reHlU-B9IOYN2yV_cmHV0QefrtYXUV72DctTLKKaBYF0Mvi-i2Q_C8orGla4nGrpuGxIE0e2hd73SojrDvad4vpXDY4JhIGbbLvg_M80ihgNTmYz0MogDPwG408ohqLTKN4k8ZmQdDboVfLbK3NCLgcnJ1ilGF5fiQkzhjsTjtNrkk6s",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDDpeopgojDm9q41qcHjXnh9CTUzFLrnpxdKAn6j1wqUQWkk1jUBzJbRp5LVCfXfABr2ZmILwYNPzTSnCY-YHLLgNebd-MvqEbkSEpX1wmpJGPT9GAVbtnC4zLAEusv1msSnHm6CVa9_pL7mamLk36iHfkXN3_pfW2HltjSdHvJogRRKD3neB2eR4TmWef3ogtu2HjY6TwhzYjUG5Gaevy22KtxTLqFURK3_aElbyDdfU9Svf55Nzjg6tvhzc0W5XBCP5Sbgr5YC9y5",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDH3hTWT6KeTX22utS4Qh_LV4zgO7QJ-WP54qRl_gYr_IImLALtdSk0zUITXGo2Rtd4nLBbHVh6OS97rlRNJeDYBs0Abqsba6ryjy6j1G4Bh-xq9BdveIM2ISyg_IacNsykNdGPra6ZkxaQ3jCTzD-JuMCYzSEWX2UyWFn_w0sNxLhjEADvKhCLwfSSs8a7DC74k8MVOprDKTov5EtCoAO_sopZufUlNlywsyA4DpItYq57_kXIz-DfG-dAhuv5KC2XYKxLQNOTWIWT",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBDcFA9WmY0T7mgIsGcuhMMfNHnSilxP0QhYoitD7J2gNO6T-Q70jXmbRF80WmKqiemp-aMn1SYpDNUKkctP9F1-rLVvOHF_Flxl_eBFk3qViNmNV8N17WIfqVdtcmb8pT1Jou1KEntoKQuAaj851OckpaUtea0xLCZL-u5bZmgTrlFUziUu3A0pyo6YPlI2BWwdgQzRHTQ6AmX7m68DMd7SNuIlHpQOmWusRVMl835OtZLclA-6Es5H9d7r3AbCaKUYwE-YbNTU3Vd",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDanE9k7ThCrchaO2NE_VYRa5r2DugS_6HE6rQoVe2jl1khgHPDyEuB2MgtJD4F-kdE2Ee5wRHBlhOFzfX9hB7ePQLjYiVlFcllMLjVnfi2z9P45FP0E-uqjMPhTw8RO2EseAl7eCG1wGXj6zME3UtZd0wpX70_XG6r6QjhIULpp3iAr_BDy-DgJUyrngWGnnx4WYbVt2E1so8o4tk0mro9VFPXgNeufD0u1TtvBiKf_bRqRSaOdUEvpgFaQjz0r0kmpOi2lrD2LmcV",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCOfI4pC1ufDfaucBMkjIMi9dwcv0B3h4uQmjYMe32TJIyKHahq8Gd1G43PjqJ-psSS9d1pfd_aeMHA4pZQNRXPco_ToMWOv77kRffdg34KekLdPAwtECACkdG7GKwAhI-29iWn6W5lHb7pNsgGH8-dGl8-3uBYB6jdn6brBW5qYkW6Frw6GCEbhmT8tQflAAj_EOPAOiE_NUn-93_gkxFocVR5bjSnIvIDqYGiers-GX0IKGPveI5tCuGzUWdSL9_RZZCkk2WzKev6"
        ].map((url, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div
              className="gallery-image"
              style={{ backgroundImage: `url(${url})` }}
            ></div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
