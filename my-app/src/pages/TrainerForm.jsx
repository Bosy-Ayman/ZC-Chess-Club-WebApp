import React, { Fragment } from "react";
import ApplicationForm from "./ApplicationForm";

const TrainerForm = () => {
  const roleTitle = "Trainer Member";
  const department = "Trainer";
  const roleDesc =
    "Provide training sessions for club members to enhance their chess skills, and create educational content such as selecting puzzles and posts for social media.";

  const roleSpecificContent = (
    <Fragment>
      <section className="form-section trainer-section">
        <h2>Section 2: Trainer Committee Questions</h2>
        <p className="section-note">
          Focus: Sharing chess knowledge and improving the skills of club members.
        </p>

        <label htmlFor="chess-score">Your highest rating (on chess.com, Lichess, FIDE, etc.)*</label>
        <input type="number" id="chess-score" name="chessScore" min="0" required />

        <label>Have you ever applied to this role before?*</label>
        <div className="radio-group">
          <input type="radio" id="trainer-previous-app-yes" name="previousApplication" value="yes" required />
          <label htmlFor="trainer-previous-app-yes">Yes</label>

          <input type="radio" id="trainer-previous-app-no" name="previousApplication" value="no" />
          <label htmlFor="trainer-previous-app-no">No</label>
        </div>

        <label htmlFor="trainer-availability">Days/times available on campus (optional)</label>
        <textarea id="trainer-availability" name="availabilityDescription" rows="3"></textarea>

        <p className="section-note" style={{ marginTop: '1.5rem', fontWeight: 600 }}>
          Please specify your typical availability for each weekday:
        </p>

        <label htmlFor="sunday-avail">Sunday*</label>
        <input type="text" id="sunday-avail" name="availabilitySunday" placeholder="e.g., 2:00 PM - 5:00 PM or Not Available" required />

        <label htmlFor="monday-avail">Monday*</label>
        <input type="text" id="monday-avail" name="availabilityMonday" placeholder="e.g., 10:00 AM - 1:00 PM or Not Available" required />

        <label htmlFor="tuesday-avail">Tuesday*</label>
        <input type="text" id="tuesday-avail" name="availabilityTuesday" placeholder="e.g., 2:00 PM - 5:00 PM or Not Available" required />

        <label htmlFor="wednesday-avail">Wednesday*</label>
        <input type="text" id="wednesday-avail" name="availabilityWednesday" placeholder="e.g., 10:00 AM - 1:00 PM or Not Available" required />

        <label htmlFor="thursday-avail">Thursday*</label>
        <input type="text" id="thursday-avail" name="availabilityThursday" placeholder="e.g., 2:00 PM - 5:00 PM or Not Available" required />
      </section>
    </Fragment>
  );

  return (
    <ApplicationForm
      title={roleTitle}
      department={department}
      roleDescription={roleDesc}
      roleSpecificContent={roleSpecificContent}
    />
  );
};

export default TrainerForm;
