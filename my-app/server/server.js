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

const Application = mongoose.model('Application', ApplicationSchema, 'chess_club');

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
});