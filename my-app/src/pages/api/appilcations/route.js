import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error("MONGO_URI is missing");

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
  submissionDate: { type: Date, default: Date.now },
});

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

export async function GET(req) {
  try {
    await connectDB();
    const apps = await Application.find().sort({ submissionDate: -1 });
    return Response.json(apps);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const app = new Application(body);
    await app.save();
    return Response.json(app, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}