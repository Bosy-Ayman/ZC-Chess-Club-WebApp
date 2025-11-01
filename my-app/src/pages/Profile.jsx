import React, { useState } from "react";
import TopHeader from "../components/TopHeader";
import Footer from "../components/Footer";

import "./Profile.css";

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="profile">
      <TopHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="profile-wrapper">
        <main className="profile-main">
          <section className="profile-top-info">
            <div className="profile-user">
              <div
                className="profile-user-img"
                style={{
                  backgroundImage: `url("/Icons/user.png")`,
                }}
              ></div>
              <div>
                <p className="user-name">Bosy Ayman</p>
                <p className="user-joined">Joined 2021</p>
              </div>
            </div>

            <button className="edit-btn">
              <span className="truncate">Edit Profile</span>
            </button>
          </section>

          <section className="rating-section">
            <h2>Current Ratings</h2>
            <div className="rating-grid">
              <div className="rating-card">
                <div
                  className="rating-icon"
                  style={{ backgroundImage: `url("/Icons/classic.jpg")` }}
                ></div>
                <div className="rating-info">
                  <p className="rating-type">Classic</p>
                  <p className="rating-value">1650</p>
                </div>
              </div>

              <div className="rating-card">
                <div
                  className="rating-icon"
                  style={{ backgroundImage: `url("Icons/blitz.png")` }}
                ></div>
                <div className="rating-info">
                  <p className="rating-type">Blitz</p>
                  <p className="rating-value">1825</p>
                </div>
              </div>

              <div className="rating-card">
                <div
                  className="rating-icon"
                  style={{ backgroundImage: `url("Icons/rapid.png")` }}
                ></div>
                <div className="rating-info">
                  <p className="rating-type">Rapid</p>
                  <p className="rating-value">1740</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="section-title">Active Tournaments</h3>
            <div className="tournament-card">
              <div className="tournament-info">
                <p className="label">Tournament</p>
                <p className="value">Weekly Blitz Challenge</p>
                <p className="status">Round 3 in progress</p>
              </div>
              <div
                className="tournament-image"
                style={{
                  backgroundImage: `url("/Images/image2.jpg")`,
                }}
              ></div>
            </div>
          </section>
          
           <section>
  <h3 className="section-title">Past Tournaments</h3>
  <div className="past-tournament-card">
    <div className="tournament-info">
      <p className="label">Tournament</p>
      <p className="value">ZC Rapid Cup</p>
      <p className="status">Finished - 🏅 Rank: 2nd</p>
    </div>
    <div
      className="tournament-image"
      style={{
        backgroundImage: `url("/Images/image1.jpg")`,
      }}
    ></div>
  </div>

  <div className="past-tournament-card">
    <div className="tournament-info">
      <p className="label">Tournament</p>
      <p className="value">Spring Blitz Knockout</p>
      <p className="status">Finished - 🏅 Rank: 5th</p>
    </div>
    <div
      className="tournament-image"
      style={{
        backgroundImage: `url("/Images/image3.jpg")`,
      }}
    ></div>
  </div>
</section>

        </main>
      </div>
      <Footer />
    </div>
  );
}
