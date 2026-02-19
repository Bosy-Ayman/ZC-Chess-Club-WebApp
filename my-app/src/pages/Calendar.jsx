import "./Calendar.css";
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Calendar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Example events
  const events = [
   { date: "2025-11-02", title: "Abdelrahaman vs Youssef", time: "12:00 PM" },
   { date: "2026-19-02", title: "Ramadan starts", time: "1:00 PM" },
    // { date: "2025-11-02", title: "Team Strategy Talk", time: "6:00 PM" },
    // { date: "2025-11-06", title: "Training Session", time: "5:30 PM" },
    // { date: "2025-11-10", title: "Rapid Tournament", time: "3:00 PM" },
    // { date: "2025-11-14", title: "OC Meeting", time: "1:00 PM" },
    // { date: "2025-11-18", title: "Team Match", time: "7:00 PM" },
  ];

  // Helper functions
  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  function firstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }
  function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const totalDays = daysInMonth(currentYear, currentMonth);
  const firstDay = firstDayOfMonth(currentYear, currentMonth);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const handleDayClick = (day) => {
    if (day === null) return;
    const selected = formatDate(currentYear, currentMonth, day);
    setSelectedDate(selected);
  };

  const selectedEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : [];

  return (
    <div className="club-wrapper">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="calendar-container">
        <section className="intro-text">
          <h1>Calendar of Events</h1>
        </section>

        {/* Header with month navigation */}
        <div className="calendar-header">
          <button onClick={prevMonth}>◀</button>
          <h2>
            {months[currentMonth]} {currentYear}
          </h2>
          <button onClick={nextMonth}>▶</button>
        </div>

        {/* Monthly Grid */}
        <div className="month-grid">
          <div className="day-name">Sun</div>
          <div className="day-name">Mon</div>
          <div className="day-name">Tue</div>
          <div className="day-name">Wed</div>
          <div className="day-name">Thu</div>
          <div className="day-name">Fri</div>
          <div className="day-name">Sat</div>

          {days.map((day, i) => {
            if (day === null)
              return <div key={i} className="day-cell empty"></div>;

            const dateKey = formatDate(currentYear, currentMonth, day);
            const dayEvents = events.filter((e) => e.date === dateKey);
            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <div
                key={i}
                className={`day-cell ${isToday ? "today" : ""}`}
                onClick={() => handleDayClick(day)}
              >
                <div className="date-num">{day}</div>
                <div className="event-list">
                  {dayEvents.slice(0, 2).map((ev, idx) => (
                    <div key={idx} className="event-item">
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="more-events">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Day Details Modal */}
        {selectedDate && (
          <div className="day-details-overlay" onClick={() => setSelectedDate(null)}>
            <div
              className="day-details"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                Events on{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>

              {selectedEvents.length > 0 ? (
                selectedEvents.map((ev, i) => (
                  <div key={i} className="event-detail-card">
                    <h4>{ev.title}</h4>
                    <p>{ev.time}</p>
                  </div>
                ))
              ) : (
                <p className="no-event-text">No events this day</p>
              )}

              <button
                className="close-btn"
                onClick={() => setSelectedDate(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
