const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// -------- MIDDLEWARE --------
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
}));
app.use(express.json());

// -------- SCHEMA --------
const ApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    idNumber: { type: String, required: true },
    phone: { type: String, required: true },
    major: { type: String, required: true },
    batch: { type: String, required: true },

    roleTitle: { type: String, required: true },
    department: { type: String, required: true },

    roleSpecificData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    submissionDate: { type: Date, default: Date.now }
});

const Application = mongoose.model("Application", ApplicationSchema);

// -------- DATABASE --------
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB error:", err);
        process.exit(1);
    });

// -------- POST: SUBMIT --------
app.post("/api/applications", async (req, res) => {
    try {
        const {
            name, email, idNumber, phone, major, batch,
            roleTitle, department, ...roleSpecificData
        } = req.body;

        const application = new Application({
            name, email, idNumber, phone, major, batch,
            roleTitle, department,
            roleSpecificData
        });

        await application.save();

        res.status(201).json({
            message: "Application submitted",
            id: application._id
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: "Email already used"
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// -------- GET: ALL APPLICATIONS --------
app.get("/api/applications", async (req, res) => {
    try {
        const apps = await Application.find().sort({ submissionDate: -1 });
        res.status(200).json(apps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -------- START SERVER --------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
