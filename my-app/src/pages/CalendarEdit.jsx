import "./CalendarEdit.css";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function CalendarEdit() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const [events, setEvents] = useState([
    { 
      date: "2025-11-02", 
      title: "Abdelrahaman vs Youssef", 
      time: "11:00 - 12:00", 
      description: "Friendly match", 
      location: "Zewail Chess Club"
    },
  ]);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Helper functions
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const formatDate = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

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
    setSelectedDate(formatDate(currentYear, currentMonth, day));
  };

  const selectedEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : [];

  const addEvent = (title, time, description = "", location = "") => {
    setEvents([...events, { date: selectedDate, title, time, description, location }]);
  };

  const deleteEvent = (index) => {
    setEvents(events.filter((e, i) => !(e.date === selectedDate && i === index)));
  };

  return (
    <div className="club-wrapper">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="calendar-edit-container">
        <h1>Editable Calendar of Events</h1>

        <div className="calendar-header">
          <button onClick={prevMonth}>◀</button>
          <h2>{months[currentMonth]} {currentYear}</h2>
          <button onClick={nextMonth}>▶</button>
        </div>

        <div className="month-grid">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} className="day-name">{d}</div>
          ))}

          {days.map((day, i) => {
            if (day === null) return <div key={i} className="day-cell empty"></div>;

            const dateKey = formatDate(currentYear, currentMonth, day);
            const dayEvents = events.filter(e => e.date === dateKey);
            const isToday = day === today.getDate() &&
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
                    <div key={idx} className="event-item">{ev.title}</div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="more-events">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {selectedDate && (
        <div className="day-details-overlay" onClick={() => setSelectedDate(null)}>
            <div className="day-details" onClick={e => e.stopPropagation()}>
            
            {/* Top-right X button */}
            <button 
                className="top-right-close" 
                onClick={() => setSelectedDate(null)}
            >
                ×
            </button>

            <h3>
                Events on {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
                })}
            </h3>

            {selectedEvents.length > 0 ? (
                selectedEvents.map((ev, i) => (
                <div key={i} className="event-detail-card">
                    <h4>{ev.title}</h4>
                    <p>{ev.time}</p>
                    {ev.location && <p className="event-location">{ev.location}</p>}
                    {ev.description && <p>{ev.description}</p>}
                    <button onClick={() => deleteEvent(events.indexOf(ev))}>Delete</button>
                </div>
                ))
            ) : <p className="no-event-text">No events this day</p>}

            <div className="add-event-form">
                <input id="event-title" placeholder="Event title" />

                <div style={{ display: "flex", gap: "4%", marginBottom: "6px" }}>
                <input type="time" id="event-from" />
                <input type="time" id="event-to" />
                </div>

                <input id="event-location" placeholder="Location" />
                <textarea id="event-desc" placeholder="Description" rows={3} />

                <button
                onClick={() => {
                    const title = document.getElementById("event-title").value;
                    const from = document.getElementById("event-from").value;
                    const to = document.getElementById("event-to").value;
                    const location = document.getElementById("event-location").value;
                    const desc = document.getElementById("event-desc").value;

                    if (title && from && to) {
                    addEvent(title, `${from} - ${to}`, desc, location);

                    // Clear inputs after adding
                    document.getElementById("event-title").value = "";
                    document.getElementById("event-from").value = "";
                    document.getElementById("event-to").value = "";
                    document.getElementById("event-location").value = "";
                    document.getElementById("event-desc").value = "";
                    }
                }}
                >
                Add Event
                </button>
            </div>

            </div>
        </div>
        )}


      </main>

      <Footer />
    </div>
  );
}
