// /app/api/applications/route.js
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  submissionDate: { type: Date, default: Date.now },
});

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI is missing");

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGO_URI);
}

export async function GET() {
  await connectDB();
  const apps = await Application.find().sort({ submissionDate: -1 });
  return new Response(JSON.stringify(apps), { status: 200 });
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const newApp = new Application(body);
  await newApp.save();
  return new Response(JSON.stringify(newApp), { status: 201 });
}
