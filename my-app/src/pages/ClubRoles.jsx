import "./ClubRoles.css";
import React, { useState } from "react";
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
      image: "/Images/training.png",
    },
    {
      department: "Tournament Organizer",
      title: "OC Member",
      desc: "Plan and execute chess tournaments, ensuring fair play and a positive experience for all participants.",
      image: "/Images/arbiter.jpeg",
    },
    {
      department: "MultiMedia",
      title: "Media Member",
      desc: "Capture, design, and produce creative content that represents the club’s activities and achievements.",
      image: "/Images/media.jpeg",
    },
    {
      department: "Trainer",
      title: "Trainer Member",
      desc: "Train new players, prepare materials for club sessions, and guide members to improve their chess skills.",
      image: "/Images/trainer.jpg",
    },
    {
      department: "Trainee",
      title: "Trainee Member",
      desc: "New members who are learning the basics of chess and developing their skills through training sessions.",
      image: "/Images/training2.jpeg",
    },
  ];

  const applications = [
    { role: "HR Member", status: "Pending", date: "2024-07-20" },
    { role: "Trainer Member", status: "Accepted", date: "2024-07-15" },
    { role: "PR Member", status: "Rejected", date: "2024-07-10" },
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
                <button className="apply-btn">soon..</button>
              </div>
              <div
                className="role-image"
                style={{ backgroundImage: `url(${role.image})` }}
              ></div>
            </div>
          ))}
        </div>

        {/* 📋 Your Applications */}
        {/* <h2 className="section-title">Your Applications</h2>
        <div className="application-table-wrapper">
          <table className="application-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Status</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={index}>
                  <td>{app.role}</td>
                  <td>
                    <span className={`status ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>{app.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </main>

      {/* 🦶 Footer */}
      <Footer />
    </div>
  );
}
