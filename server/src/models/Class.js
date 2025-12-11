import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    // ✅ NEW FIELD: Class Start Time
    classStartTime: {
      type: String,
      required: true,
    },

    // ✅ NEW FIELD: Class End Time
    classEndTime: {
      type: String,
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
