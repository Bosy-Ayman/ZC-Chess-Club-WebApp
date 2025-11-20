import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI);

const ApplicationSchema = new mongoose.Schema({
    name: String,
    email: String,
    idNumber: String,
    phone: String,
    major: String,
    batch: String,
    roleTitle: String,
    department: String,
    roleSpecificData: { type: mongoose.Schema.Types.Mixed, default: {} },
    submissionDate: { type: Date, default: Date.now }
});

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

export default async function handler(req, res) {
    if (req.method === "GET") {
        const apps = await Application.find().sort({ submissionDate: -1 }).lean();
        return res.status(200).json(apps);
    }
    if (req.method === "POST") {
        const data = req.body;
        const app = new Application(data);
        await app.save();
        return res.status(201).json({ message: "Application submitted", id: app._id });
    }
    res.status(405).json({ error: "Method not allowed" });
}
