import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faceDescriptor: { type: [Number], required: true },
  attendance: { type: Boolean, default: false },
});

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
export default Employee;
