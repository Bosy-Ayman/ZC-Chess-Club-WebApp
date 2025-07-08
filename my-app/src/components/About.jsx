import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#171512] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
    <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="layout-container flex h-full grow flex-col">


        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white text-[32px] font-bold leading-tight">About Our Chess Club</p>
                <p className="text-[#b5afa1] text-sm font-normal leading-normal">
                  Learn more about our mission, values, and the team behind the Chess Club.
                </p>
              </div>
            </div>

            <h2 className="text-white text-[22px] font-bold px-4 pb-3 pt-5">Our Mission</h2>
            <p className="text-white text-base font-normal px-4 pb-3 pt-1">
              Our mission is to promote the game of chess, foster a community of chess enthusiasts, and provide opportunities for players of all skill levels to improve their game.
              We strive to create a welcoming and inclusive environment where members can learn, compete, and connect with fellow chess lovers.
            </p>

            <h2 className="text-white text-[22px] font-bold px-4 pb-3 pt-5">Our Values</h2>
            <p className="text-white text-base font-normal px-4 pb-3 pt-1">
              We are committed to excellence, integrity, and sportsmanship. We value continuous learning, fair play, and mutual respect among our members.
              We believe that chess is not just a game, but a tool for developing critical thinking, problem-solving skills, and strategic planning.
            </p>

            <h2 className="text-white text-[22px] font-bold px-4 pb-3 pt-5">Meet the Team</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {/* Team Member 1 */}
              <div className="flex flex-col gap-3 text-center pb-3">
                <div className="px-4">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDup9i5-thkUJx1DzEYJ_KpyXmshdkFetfuwRp-BDhPGg0F5ch-kMViHqHrJgC2eQ_VgUBkcsooiBazZwIxgrxF8xCqnSH6RzzI2cP4ip_ENUgqlfLkGZGqWAwKa9TahHwfTQC2v1-S08jS4yiwhXsrPo0DeM7GohcS7XD1glY1ldF4m96Wiiqzr3f1fkHxf2pu1Xfe5g6BpJdBlrqpbUGAW96n9TEbJmSyrScdgZrVTxq6QX0CVUNLAWG_T6A99KKJKDjLdHZ5QGHZ")',
                    }}
                  ></div>
                </div>
                <div>
                  <p className="text-white text-base font-medium">Bosy Ayman</p>
                  <p className="text-[#b5afa1] text-sm">President</p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="flex flex-col gap-3 text-center pb-3">
                <div className="px-4">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCnZcCKeqtMilSezMD9G548J_q5iSom29sJGz7Gi4IX9XtMnR8wJ55ooiqTD3LhtD8km-5FlUntWVK00Ai9uKUKsa70a9VXBdxDvrC_lM8KDr5msk_AbKLprOejaoQ5PgChWnHo_IOtg_qH_3zINP1ixYJVus549LtGe_Rus9zmEhZd4GzPOxQi8G2BAvbCbszeD4_v1h8rcuoOSZjt9AIo9CF39xr67wetunSxB5fMJgORfi3WUBzlhJAa8AWNQMj9je1sVbKGWTa8")',
                    }}
                  ></div>
                </div>
                <div>
                  <p className="text-white text-base font-medium">Abdelrahman Mohamed</p>
                  <p className="text-[#b5afa1] text-sm">Vice President</p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="flex flex-col gap-3 text-center pb-3">
                <div className="px-4">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvPAXYY2ptA33LAwV6J1Du6fOThSKMSpS1DTtqVmoU4d4vZJc_6Fu62K9pdbHFhTOLACcG2yLtQLQlcIYnpfdlaEdiCOE4LrYkw07N8NC5V1Liv7qJHp0-hQ01UUL6L4TQx9yv7TAM-HDRqP4zs47C4c0XnTwTx3Y4Za_KlXnuX-qXuSxBgLldqTi3S1J5REAo_if6KWWKxVpxBxqqhColaBruofvTeyrsE3fJYkdfw7ta4dXqnWuTH_la9yybmU7gyUfcemte76_M")',
                    }}
                  ></div>
                </div>
                <div>
                  <p className="text-white text-base font-medium">Aml Maiof</p>
                  <p className="text-[#b5afa1] text-sm">Head of Human Resources</p>
                </div>
              </div>
              {/* Team Member 4 */}
              <div className="flex flex-col gap-3 text-center pb-3">
                <div className="px-4">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvPAXYY2ptA33LAwV6J1Du6fOThSKMSpS1DTtqVmoU4d4vZJc_6Fu62K9pdbHFhTOLACcG2yLtQLQlcIYnpfdlaEdiCOE4LrYkw07N8NC5V1Liv7qJHp0-hQ01UUL6L4TQx9yv7TAM-HDRqP4zs47C4c0XnTwTx3Y4Za_KlXnuX-qXuSxBgLldqTi3S1J5REAo_if6KWWKxVpxBxqqhColaBruofvTeyrsE3fJYkdfw7ta4dXqnWuTH_la9yybmU7gyUfcemte76_M")',
                    }}
                  ></div>
                </div>
                <div>
                  <p className="text-white text-base font-medium">Momen</p>
                  <p className="text-[#b5afa1] text-sm">Head of Training</p>
                </div>
              </div>
            </div>

            <h2 className="text-white text-[22px] font-bold px-4 pb-3 pt-5">Contact Us</h2>
            <p className="text-white text-base font-normal px-4 pb-3 pt-1">
              If you have any questions or would like to learn more about our club, please feel free to reach out to us at zcchessclub@zewailcity.edu.eg or call us at (555) 123-4567.
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
