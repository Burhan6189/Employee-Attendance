import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  irisDescriptor: { type: Array, required: true }, // Store iris feature vectors
  attendance: { type: Boolean, default: false },
});

 const IrisEmployeeModel= mongoose.models.IrisEmployee || mongoose.model("IrisEmployee", EmployeeSchema);
 export default IrisEmployeeModel;