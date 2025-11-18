import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// -------- CONNECT ONCE --------
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// -------- SCHEMA --------
const ApplicationSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  idNumber: String,
  phone: String,
  major: String,
  batch: String,
  roleTitle: String,
  department: String,
  roleSpecificData: mongoose.Schema.Types.Mixed,
  submissionDate: { type: Date, default: Date.now }
});

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);

// -------- POST (CREATE) --------
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const app = await Application.create(body);

    return NextResponse.json({ message: "Application submitted", id: app._id });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: "Email already used" }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// -------- GET (READ ALL) --------
export async function GET() {
  try {
    await connectDB();
    const apps = await Application.find().sort({ submissionDate: -1 });
    return NextResponse.json(apps);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
