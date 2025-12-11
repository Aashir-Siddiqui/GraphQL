import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    // ✅ CHANGE: 'subject' is now an array of strings
    subject: {
      type: [String], // Array of Strings
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
