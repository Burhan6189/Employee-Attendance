import mongoose from "mongoose";
import IrisEmployeeModel from "@/app/models/IrisEmployee";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const { name, email, irisDescriptor } = await req.json();

    if (!name || !email || !irisDescriptor) {
      return Response.json({ message: "❌ Missing required fields" }, { status: 400 });
    }

    const newEmployee = new IrisEmployeeModel({ name, email, irisDescriptor });
    await newEmployee.save();

    return Response.json({ message: "✅ Employee added successfully!" }, { status: 201 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return Response.json({ message: "❌ Server Error" }, { status: 500 });
  }
}
