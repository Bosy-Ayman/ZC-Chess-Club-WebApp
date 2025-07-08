import React from 'react';
import './Profile.css'; // Assuming you created a Profile.css file

export default function Profile() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#221d11] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Sidebar/Profile Info */}
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#221d11] p-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBwhFu9ZemB9lFGA1hCYYqqHGQ48H71woJ4F7hOIVUBFwJizXqhVEILqVqtVtHNBNeGjjvz4u8vY2FmCG9PcFwxUD4utVyVg32OIUs7u4SDB4k7HeAfS0GE7xqSM8RQQ3K50B-6FYJqnVaKFeklcm49ZMWwAiJqbpCLGobwMiN2IhHssf8l0kAUCRa4PF6FRPgrhXHAPLajVUe1-F6BG9TWAA2AihtjQujAQyJQeX3eoFkPV-IsnhhHXpAaChz6bpfM24pd6d3k_7tO")',
                    }}
                  ></div>
                  <div className="flex flex-col">
                    <h1 className="text-white text-base font-medium leading-normal">Sophia</h1>
                    <p className="text-[#caba91] text-sm font-normal leading-normal">Premium</p>
                  </div>
                </div>

                {/* Sidebar Menu */}
                <div className="flex flex-col gap-2">
                  {[
                    { icon: 'House', label: 'Home' },
                    { icon: 'Horse', label: 'Play' },
                    { icon: 'GraduationCap', label: 'Learn' },
                    { icon: 'Users', label: 'Community' },
                    { icon: 'Television', label: 'Watch' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 px-3 py-2 ${item.label === 'Home' ? 'rounded-lg bg-[#483e23]' : ''}`}
                    >
                      <div className="text-white" data-icon={item.icon} data-size="24px" data-weight="regular" />
                      <p className="text-white text-sm font-medium leading-normal">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Profile</p>
            </div>

            {/* Top Info */}
            <div className="flex p-4 @container">
              <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                <div className="flex gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDAzfCGk2YQS6YVcfZiDPbf_1jqwjk_vb08bxVprXpA73LaPor4cZM25bTSCrxeU8xhdNknfmdStCC2Bz2nt4x1jyLFpJKeic7614rqrXDclfLHGnihe-tUvoSU1Ab22pI8Li7y2g4H29g07D4b39AwSATRa67uJanWFDi8Evn5_lMqQ1Wt_C1LK3pNFYdnwWDJO57VxmPsWXSBerO0KADQKb5aIpA9_3x2dyLgGx7Ga4PJJnyD_Eg0lX4TGSWPrk6XALMcu5I7KovR")',
                    }}
                  ></div>
                  <div className="flex flex-col justify-center">
                    <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Sophia</p>
                    <p className="text-[#caba91] text-base font-normal leading-normal">Joined 2021</p>
                  </div>
                </div>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#483e23] text-white text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto">
                  <span className="truncate">Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Active Tournaments */}
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Active Tournaments</h2>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-lg">
                <div className="flex flex-col gap-1 flex-[2_2_0px]">
                  <p className="text-[#caba91] text-sm font-normal leading-normal">Tournament</p>
                  <p className="text-white text-base font-bold leading-tight">Weekly Blitz Challenge</p>
                  <p className="text-[#caba91] text-sm font-normal leading-normal">Round 3 in progress</p>
                </div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAcsq6FdO8bVr_sZbXzvtXiL-RfsI-irtcvRFaivPNgXHZboyFaJ9xDELg4maZOL7JaBAtxkHcNdsvCXdgiSXia54kJklsQrB0DBLTeW60VvFZdoV7CfAdEvFT-WzzWtLLakYXQml71dXHAvrqm12ThYkICgiHrSj8d1Atxby7v__ooP7NQI68PTcPZ3IXUgBy8rT7qQHWgGWLKVX-TlIgCc9tOsDoAPQNdk6xP70tyMy4Oo4LDBOQz0b3za9hPwXazBLe0Kcz80R15")',
                  }}
                ></div>
              </div>
            </div>

            {/* Other Sections */}
            {/* Past Results, Puzzle Challenge Progress, Club Roles */}
            {/* Keep same as original – already correct structure */}
            {/* You can continue these sections here... */}
          </div>
        </div>
      </div>
    </div>
  );
}
