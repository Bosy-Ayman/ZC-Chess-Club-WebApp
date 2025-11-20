// // File: /pages/api/applications.js
// import mongoose from "mongoose";

// // --- MongoDB Connection ---
// const MONGO_URI = process.env.MONGO_URI;
// if (!MONGO_URI) {
//   throw new Error("MONGO_URI is not defined in environment variables.");
// }

// if (!mongoose.connection.readyState) {
//   await mongoose.connect(MONGO_URI);
// }

// // --- Mongoose Schema & Model ---
// const ApplicationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   idNumber: { type: String, required: true },
//   phone: { type: String, required: true },
//   major: { type: String, required: true },
//   batch: { type: String, required: true },
//   roleTitle: { type: String, required: true },
//   department: { type: String, required: true },
//   roleSpecificData: { type: mongoose.Schema.Types.Mixed, default: {} },
//   submissionDate: { type: Date, default: Date.now }
// });

// const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

// // --- API Handler ---
// export default async function handler(req, res) {
//   if (req.method === "GET") {
//     try {
//       const applications = await Application.find().sort({ submissionDate: -1 }).lean();
//       return res.status(200).json(applications);
//     } catch (err) {
//       console.error("Failed to fetch applications:", err);
//       return res.status(500).json({ error: "Failed to fetch applications", details: err.message });
//     }
//   }

//   if (req.method === "POST") {
//     try {
//       const { name, email, idNumber, phone, major, batch, roleTitle, department, ...roleSpecificData } = req.body;
//       const newApplication = new Application({ name, email, idNumber, phone, major, batch, roleTitle, department, roleSpecificData });
//       await newApplication.save();
//       return res.status(201).json({ message: "Application submitted successfully!", id: newApplication._id });
//     } catch (err) {
//       console.error("Failed to save application:", err);

//       if (err.name === "ValidationError") {
//         return res.status(400).json({ error: "Validation failed", details: err.message });
//       }

//       if (err.code === 11000) {
//         return res.status(409).json({ error: "Email already exists", details: err.keyValue });
//       }

//       return res.status(500).json({ error: "Failed to save application", details: err.message });
//     }
//   }

//   res.setHeader("Allow", ["GET", "POST"]);
//   res.status(405).end(`Method ${req.method} Not Allowed`);
// }
