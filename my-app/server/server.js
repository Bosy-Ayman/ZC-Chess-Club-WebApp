// pages/api/applications.js
import { connectDB } from "./server/mongodb";
import mongoose from "mongoose";

// -------- Schema --------
const ApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true },
  phone: { type: String, required: true },
  major: { type: String, required: true },
  batch: { type: String, required: true },

  roleTitle: { type: String, required: true },
  department: { type: String, required: true },

  roleSpecificData: { type: mongoose.Schema.Types.Mixed, default: {} },

  submissionDate: { type: Date, default: Date.now },
});

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);

// -------- API HANDLER --------
export default async function handler(req, res) {
  await connectDB();

  // ----- SUBMIT (POST) -----
  if (req.method === "POST") {
    try {
      const {
        name, email, idNumber, phone, major, batch,
        roleTitle, department, ...roleSpecificData
      } = req.body;

      const app = await Application.create({
        name, email, idNumber, phone, major, batch,
        roleTitle, department,
        roleSpecificData
      });

      return res.status(201).json({
        message: "Application submitted",
        id: app._id
      });

    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Email already used" });
      }
      return res.status(500).json({ error: err.message });
    }
  }

  // ----- GET ALL -----
  if (req.method === "GET") {
    try {
      const apps = await Application.find().sort({ submissionDate: -1 });
      return res.status(200).json(apps);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
