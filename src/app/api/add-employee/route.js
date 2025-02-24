import Employee from '@/app/models/Employee';
import mongoose from 'mongoose';

// Database connection utility
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (mongoose.connection.readyState === 2) return; // Prevent duplicate connections

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw new Error('Database connection failed');
  }
};

// POST API handler
export async function POST(req) {
  try {
    await connectDB();
    const { name, faceDescriptor } = await req.json();

    if (!name || !faceDescriptor) {
      return new Response(JSON.stringify({ message: '❌ Invalid data: Name and faceDescriptor are required.' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const faceDescriptorArray = Object.values(faceDescriptor);

    const newEmployee = new Employee({ name, faceDescriptor:faceDescriptorArray });
    await newEmployee.save();

    return new Response(JSON.stringify({ message: '✅ Employee saved successfully!' }), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('❌ Server Error:', error);
    return new Response(JSON.stringify({ message: '❌ Server error, please try again later.' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
