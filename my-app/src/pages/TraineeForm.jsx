import React, { Fragment } from "react";
import ApplicationForm from "./ApplicationForm";

const TraineeForm = () => {
  const roleTitle = "Trainee Member";
  const department = "Trainee";
  const roleDesc =
    "New members learning the basics of chess through structured training sessions.";

  const roleSpecificContent = (
    <Fragment>
      <section className="form-section trainee-section">
        <h2>Section 2: Trainee Skill Assessment</h2>
        <label>Current Chess Skill Level*</label>
        <select name="trainee-skill-level" required>
          <option value="">-- Select Level --</option>
          <option value="new">Brand New</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
        </select>

        <label>Goals for Joining*</label>
        <textarea name="trainee-goals" rows="4" required></textarea>
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

export default TraineeForm;
