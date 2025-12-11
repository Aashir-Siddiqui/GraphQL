import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LEAVE"],
      required: [true, "Attendance status is required"],
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for id field
attendanceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Index for faster queries
attendanceSchema.index({ student: 1, date: -1 });
attendanceSchema.index({ class: 1, date: -1 });

export default mongoose.model("Attendance", attendanceSchema);
