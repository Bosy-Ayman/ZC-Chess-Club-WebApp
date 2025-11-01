import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./HomePage.css";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [date, setDate] = useState(new Date());

  const galleryImages = [
    "/images/image1.jpg",
    "/images/image4.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg",
  ];

  return (
    <div className="homepage">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Hero Section */}
      <section className="hero-section">
        <video
          className="hero-video"
          src="/background_video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to ZC Chess Club</h1>
          <p>
            Manage and participate in chess tournaments with ease. Join our
            community of chess enthusiasts today!
          </p>
          <div className="hero-buttons">
            <a href="/signup">
              <button className="signup-btn">Sign Up</button>
            </a>
            <button className="explore-btn">Explore Tournaments</button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section">
        <h2>News and Announcements</h2>
        <div className="news-card">
          <div
            className="news-image"
            style={{ backgroundImage: `url("/images/Tournament1.png")` }}
          ></div>
          <div className="news-text">
            <p className="news-title">Upcoming Chess Tournament</p>
            <p className="news-description">
              Join our annual chess tournament on July 15th. Register now to
              compete for the grand prize!
            </p>
            <button className="register-btn">Register Now</button>
          </div>
        </div>
      </section>

      {/* Winners Section */}
      <section className="winners-section">
        <h2>Recent Tournament Winners</h2>
        <div className="winners-grid">
          <div className="winner-card">
            <div
              className="winner-image"
              style={{ backgroundImage: `url("/Winners/Winner1.png")` }}
            ></div>
            <div>
              <p className="winner-name">Abdelrahman Mohamed</p>
              <p className="winner-title">
                First Place of the Ramadan Tournament
              </p>
            </div>
          </div>
          <div className="winner-card">
            <div
              className="winner-image"
              style={{ backgroundImage: `url("/Winners/Winner2.png")` }}
            ></div>
            <div>
              <p className="winner-name">Mazen Ahmed</p>
              <p className="winner-title">
                Runner-up in the Ramadan Tournament
              </p>
            </div>
          </div>
          <div className="winner-card">
            <div
              className="winner-image"
              style={{ backgroundImage: `url("/Winners/Winner3.png")` }}
            ></div>
            <div>
              <p className="winner-name">Abdelrahman Mane3</p>
              <p className="winner-title">
                Third Place in the Ramadan Tournament
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <h2>Photo Gallery</h2>
        <div className="gallery-grid">
          {galleryImages.map((url, i) => (
            <div key={i} className="gallery-card">
              <div
                className="gallery-image"
                style={{ backgroundImage: `url(${url})` }}
              ></div>
            </div>
          ))}
        </div>
      </section>

      {/* Calendar Section */}
      <section className="calendar-section">
        <h2>Calendar of Events</h2>
        <div className="calendar-container">
          <Calendar onChange={setDate} value={date} />
          <p className="selected-date">
            Selected date: {date.toDateString()}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
