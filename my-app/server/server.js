const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ----------- MIDDLEWARE -----------
app.use(cors());
app.use(express.json());


// ----------- MONGOOSE SCHEMA -----------
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


// ----------- MONGODB CONNECTION -----------
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("ERROR: MONGO_URI missing in .env");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });


// ----------- POST: SUBMIT APPLICATION -----------
app.post("/api/applications", async (req, res) => {
    console.log("------------------------------");
    console.log("Incoming Application:", req.body);
    console.log("------------------------------");

    try {
        const {
            name,
            email,
            idNumber,
            phone,
            major,
            batch,
            roleTitle,
            department,
            ...roleSpecificData
        } = req.body;

        const newApplication = new Application({
            name,
            email,
            idNumber,
            phone,
            major,
            batch,
            roleTitle,
            department,
            roleSpecificData
        });

        await newApplication.save();

        res.status(201).json({
            message: "Application submitted successfully",
            id: newApplication._id
        });

    } catch (error) {
        // validation errors
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: "Validation failed",
                details: Object.keys(error.errors)
            });
        }

        // duplicate email
        if (error.code === 11000) {
            return res.status(409).json({
                error: "This email already submitted an application",
                field: error.keyValue
            });
        }

        res.status(500).json({
            error: "Server error",
            message: error.message
        });
    }
});


// ----------- GET: ALL APPLICATIONS -----------
app.get("/api/applications", async (req, res) => {
    try {
        const applications = await Application.find().sort({ submissionDate: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch applications",
            message: error.message
        });
    }
});


// ----------- START SERVER -----------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
