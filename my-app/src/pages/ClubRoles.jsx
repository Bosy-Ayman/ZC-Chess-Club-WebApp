// src/pages/ClubRoles.js

import "./ClubRoles.css";
import React, { useState } from "react";
import { Link } from "react-router-dom"; // 👈 IMPORT LINK
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClubRoles() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const roles = [
    {
      department: "Human Resources",
      title: "HR Member",
      desc: "Manage club members, handle inquiries, and ensure smooth communication within the club.",
      image: "/Images/HR.jpg",
      path: "/apply/hr", // 👈 ADD PATH
    },
    {
      department: "Tournament Organizer",
      title: "OC Member",
      desc: "Plan and execute chess tournaments, ensuring fair play and a positive experience for all participants.",
      image: "/Images/arbiter.jpeg",
      path: "/apply/oc-member", // 👈 ADD PATH
    },
    {
      department: "Multimedia",
      title: "Media Member",
      desc: "Capture, design, and produce creative content that represents the club’s activities and achievements.",
      image: "/Images/media.jpeg",
      path: "/apply/multimedia", // 👈 ADD PATH (Matches previous setup)
    },
    {
      department: "Trainer",
      title: "Trainer Member",
      desc: "Train new players, prepare materials for club sessions, and guide members to improve their chess skills.",
      image: "/Images/trainer.jpg",
      path: "/apply/trainer", // 👈 ADD PATH
    },
    {
      department: "Trainee",
      title: "Trainee Member",
      desc: "New members who are learning the basics of chess and developing their skills through training sessions.",
      image: "/Images/trainee2.jpg",
      path: "/apply/trainee", // 👈 ADD PATH
    },
  ];

  return (
    <div className="club-wrapper">
      {/* 🧭 Header */}
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="clubroles-container">
        {/* 🌟 Intro Section */}
        <section className="intro-text">
          <h1>Club Role Applications</h1>
          <p>
            Apply for various roles within the club and track your application status.
          </p>
        </section>

        {/* 🧩 Available Roles */}
        <h2 className="section-title">Available Roles</h2>
        <div className="role-card-container">
          {roles.map((role, index) => (
            <div key={index} className="role-card">
              <div className="role-info">
                <p className="department">{role.department}</p>
                <p className="title">{role.title}</p>
                <p className="desc">{role.desc}</p>
                {/* 🎯 USE LINK FOR NAVIGATION */}
                <Link to={role.path} className="apply-btn-link">
                    <button className="apply-btn">Apply Now</button>
                </Link>
              </div>
              <div
                className="role-image"
                style={{ backgroundImage: `url(${role.image})` }}
              ></div>
            </div>
          ))}
        </div>

        {/* 📋 Your Applications (Commented out) */}
      </main>

      {/* 🦶 Footer */}
      <Footer />
    </div>
  );
}