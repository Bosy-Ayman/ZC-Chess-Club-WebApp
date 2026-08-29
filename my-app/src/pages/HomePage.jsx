import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Award, Bell, Images, Sparkles, ChevronDown, Pin, ExternalLink, Calendar, MapPin } from "lucide-react";
import "./HomePage.css";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const heroSlides = [
    "/Images/Tournaments/2024-2025/KingQuest1_1.jpg",
    "/Images/Tournaments/2024-2025/KingQuest2.jpg",
    "/Images/Tournaments/2025-2026/TeamsTournament.jpg",
    "/Images/Tournaments/2024-2025/NileUni.jpg",
    "/Images/Tournaments/2025-2026/AASTUni.jpg",

  ];

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const announcements = [
    {
      id: 1,
      pinned: true,
      category: "tournament",
      categoryLabel: "Tournament",
      title: "ZC Rapid Championship — Coming Soon",
      description:
        "Our biggest chess event of the semester is being prepared. Stay tuned for the official schedule, registration link, and prize pool announcement.",
      date: "Week 9, 2026",
      image: "/Images/Tournaments/2024-2025/KingQuest1_3.png",
      link: "/tournaments",
      linkLabel: "View Tournaments",
    },
    {
      id: 2,
      pinned: false,
      category: "puzzle",
      categoryLabel: "Puzzle Challenge",
      title: "Weekly Puzzle is Live!",
      description:
        "A new tactical puzzle challenge has been posted. Solve it to earn points and climb the leaderboard.",
      date: "Aug 27, 2026",
      image: null,
      link: "/puzzlechallenge",
      linkLabel: "Solve Now",
    },
    {
      id: 3,
      pinned: false,
      category: "recruitment",
      categoryLabel: "Join Us",
      title: "Club Applications Now Open",
      description:
        "We are recruiting for the Organizing Committee, HR, Multimedia, and Training departments. Apply before spots fill up!",
      date: "Aug 25, 2026",
      image: null,
      link: "/clubroles",
      linkLabel: "Apply Now",
    },
  ];

  const pinnedAnnouncement = announcements.find((a) => a.pinned);
  const otherAnnouncements = announcements.filter((a) => !a.pinned);

  const galleryImages = [
    "/Images/Tournaments/2024-2025/image1.jpg",
    "/Images/Tournaments/2024-2025/image4.jpg",
    "/Images/Tournaments/2024-2025/image2.jpg",
    "/Images/Tournaments/2024-2025/image3.jpg",
  ];

  return (
    <div className="homepage">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Hero Section */}
      <section className="hero-section" id="hero">
        {/* Image slideshow replaces video — SEO friendly, no thumbnail required */}
        <div className="hero-slideshow" aria-hidden="true">
          {heroSlides.map((src, i) => (
            <div
              key={src}
              className={`hero-slide${i === heroIndex ? " active" : ""}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={13} />
            <span>Zewail City Chess Community</span>
          </div>
          <h1>Welcome to ZC Chess Club</h1>
          <p>
            Manage and participate in chess tournaments with ease. Join our
            community of chess enthusiasts today!
          </p>
          <div className="hero-buttons">
            <a href="/tournaments">
              <button className="explore-btn">Explore Tournaments</button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <a className="scroll-indicator" href="#news" aria-label="Scroll down">
          <ChevronDown size={28} strokeWidth={1.8} />
        </a>
      </section>

      <div className="section-divider" />

      {/* News & Announcements Section */}
      <section className="news-section" id="news">
        <h2>
          <Bell size={22} />
          News &amp; Announcements
        </h2>

        {/* Featured / Pinned announcement */}
        {pinnedAnnouncement && (
          <div className="news-featured-card">
            <div
              className="news-featured-image"
              style={{ backgroundImage: `url("${pinnedAnnouncement.image}")` }}
            >
              <div className="news-featured-overlay" />
              <div className="news-featured-body">
                <div className="news-featured-badges">
                  <span className="news-pin-badge">
                    <Pin size={11} />
                    Pinned
                  </span>
                  <span className={`news-category-tag news-category-tag--${pinnedAnnouncement.category}`}>
                    {pinnedAnnouncement.categoryLabel}
                  </span>
                </div>
                <h3 className="news-featured-title">{pinnedAnnouncement.title}</h3>
                <p className="news-featured-desc">{pinnedAnnouncement.description}</p>
                <div className="news-featured-footer">
                  <span className="news-date">
                    <Calendar size={13} />
                    {pinnedAnnouncement.date}
                  </span>
                  <a href={pinnedAnnouncement.link} className="news-cta-btn">
                    {pinnedAnnouncement.linkLabel}
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Smaller announcement cards */}
        {otherAnnouncements.length > 0 && (
          <div className="news-cards-grid">
            {otherAnnouncements.map((item) => (
              <div key={item.id} className="news-mini-card">
                <div className="news-mini-header">
                  <span className={`news-category-tag news-category-tag--${item.category}`}>
                    {item.categoryLabel}
                  </span>
                  <span className="news-date">
                    <Calendar size={12} />
                    {item.date}
                  </span>
                </div>
                <h4 className="news-mini-title">{item.title}</h4>
                <p className="news-mini-desc">{item.description}</p>
                <a href={item.link} className="news-mini-link">
                  {item.linkLabel} →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="section-divider" />

      {/* Winners Section */}
      <section className="winners-section" id="winners">
        <h2>
          <Award size={22} />
          Recent Tournament Winners
        </h2>
        <div className="winners-grid">
          <div className="winner-card premium-card">
            <div
              className="winner-image"
              style={{ backgroundImage: `url("/Winners/Winner1.png")` }}
            ></div>
            <div>
              <p className="winner-name">Abdelrahman Mohamed</p>
              <p className="winner-title">
                First Place — Ramadan Tournament
              </p>
            </div>
          </div>
          <div className="winner-card premium-card">
            <div
              className="winner-image"
              style={{ backgroundImage: `url("/Winners/Winner2.png")` }}
            ></div>
            <div>
              <p className="winner-name">Mazen Ahmed</p>
              <p className="winner-title">
                Runner-up — Ramadan Tournament
              </p>
            </div>
          </div>
          <div className="winner-card premium-card">
            <div
              className="winner-image"
              style={{ backgroundImage: `url("/Winners/Winner3.png")` }}
            ></div>
            <div>
              <p className="winner-name">Abdelrahman Mane3</p>
              <p className="winner-title">
                Third Place — Ramadan Tournament
              </p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a
            href="/history?tab=halloffame"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #f3c144, #d4a32a)",
              color: "#15120c",
              padding: "11px 24px",
              borderRadius: "999px",
              fontWeight: "700",
              fontSize: "0.88rem",
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(243, 193, 68, 0.3)",
              transition: "all 0.25s ease",
            }}
          >
            🏆 Explore Full Hall of Fame &amp; Past Champions →
          </a>
        </div>
      </section>

      <div className="section-divider" />

      {/* Gallery Section */}
      <section className="gallery-section" id="gallery">
        <h2>
          <Images size={22} />
          Photo Gallery
        </h2>
        <div className="gallery-grid">
          {galleryImages.map((url, i) => (
            <div key={i} className="gallery-card premium-card p-1">
              <div
                className="gallery-image"
                style={{ backgroundImage: `url(${url})` }}
              ></div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Location Section */}
      <section className="location-section" id="location">
        <h2>
          <MapPin size={22} />
          Find Us
        </h2>
        <p className="location-description">
          We're based at Zewail City of Science and Technology. Visit us to play, learn, and grow your chess skills!
        </p>
        <div className="location-map-wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13829.260647009416!2d31.057944756637557!3d29.941612099605063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145851c4e4764643%3A0xc68aa33599a96301!2sZewail%20City%20of%20Science%20and%20Technology!5e0!3m2!1sen!2seg!4v1787918469421!5m2!1sen!2seg"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "16px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Zewail City Location"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
