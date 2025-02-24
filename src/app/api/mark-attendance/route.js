import mongoose from 'mongoose';
import * as faceapi from 'face-api.js';
import Employee from '@/app/models/Employee';

export async function POST(req) {
  try {
    // Ensure database connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const { faceDescriptor } = await req.json();

    // Ensure faceDescriptor is valid
    if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
      return Response.json({ message: '❌ Invalid face descriptor received.' }, { status: 400 });
    }

    const employees = await Employee.find();
    if (employees.length === 0) {
      return Response.json({ message: '❌ No employees in database.' }, { status: 404 });
    }

    let bestMatch = null;
    let minDistance = 0.5; // Threshold for a valid match

    for (const employee of employees) {
      if (!employee.faceDescriptor || !Array.isArray(employee.faceDescriptor)) continue;

      // Convert descriptors to Float32Array if needed
      const storedDescriptor = new Float32Array(employee.faceDescriptor);
      const inputDescriptor = new Float32Array(faceDescriptor);

      // Ensure both descriptors have the same length
      if (storedDescriptor.length !== inputDescriptor.length) {
        console.warn(`Skipping employee ${employee.name}: Descriptor length mismatch.`);
        continue;
      }

      const distance = faceapi.euclideanDistance(inputDescriptor, storedDescriptor);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = employee;
      }
    }

    if (!bestMatch) {
      return Response.json({ message: '❌ Employee Not Found!' }, { status: 404 });
    }

    // Mark attendance
    bestMatch.attendance = true;
    await bestMatch.save();

    return Response.json({ message: `✅ ${bestMatch.name} marked as present!` });
  } catch (error) {
    console.error('❌ API Error:', error);
    return Response.json({ message: '❌ Server Error' }, { status: 500 });
  }
}
