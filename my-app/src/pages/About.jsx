import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./About.css";

export default function About() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const teamMembers = [
    {
      name: "Bosy Ayman",
      role: "President",
      image: "/Icons/user.png",
    },
    {
      name: "Abdelrahman Mohamed",
      role: "Vice President",
      image: "/Winners/Winner1.png",
    },
    {
      name: "Aml Ali",
      role: "Head of Human Resources",
      image: "/Images/Aml.png", 
    },
    {
      name: "Momen Mahmoud",
      role: "Head of Training",
      image: "/Images/momen.png", 
    },
    {
      name: "Rana Ahmed",
      role: "Head of Multimedia",
      image: "/Images/Rana.jpg", 
    },
    {
      name: "Coming Soon..",
      role: "Head of Organization",
      image: "/Images/unknown.png", 
    },
  ];

  return (
    <div className="about-page">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="about-content">
        <div className="about-wrapper">
          <div className="about-header">
            <div className="about-intro">
              <p className="title">About Our Chess Club</p>
              <p className="subtitle">
                Learn more about our mission, values, and the team behind the Chess Club.
              </p>
            </div>
          </div>

          <section>
            <h2 className="section-title">Our Mission</h2>
            <p className="section-text">
              Our mission is to promote the game of chess, foster a community of chess enthusiasts,
              and provide opportunities for players of all skill levels to improve their game. We
              strive to create a welcoming and inclusive environment where members can learn,
              compete, and connect with fellow chess lovers.
            </p>
          </section>

          <section>
            <h2 className="section-title">Our Values</h2>
            <p className="section-text">
              We are committed to excellence, integrity, and sportsmanship. We value continuous
              learning, fair play, and mutual respect among our members. We believe that chess is
              not just a game, but a tool for developing critical thinking, problem-solving skills,
              and strategic planning.
            </p>
          </section>

          <section>
            <h2 className="section-title">Meet the Team</h2>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member">
                  <img
                    src={member.image || "/Icons/user.png"}
                    alt={member.name}
                    className="avatar"
                  />
                  <p className="member-name">{member.name}</p>
                  <p className="member-role">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-title">Contact Us</h2>
            <p className="section-text">
              If you have any questions or would like to learn more about our club, please feel
              free to reach out to us at{" "}
              <a href="mailto:zcchessclub@zewailcity.edu.eg">zcchessclub@zewailcity.edu.eg</a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
