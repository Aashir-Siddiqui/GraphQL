import Attendance from "../../models/Attendance.js";

export const attendanceResolver = {
  Query: {
    getAttendance: async () => {
      try {
        const records = await Attendance.find()
          .populate("student")
          .populate("class")
          .lean();

        return records.map((record) => ({
          ...record,
          id: record._id.toString(),
          student: record.student
            ? {
                ...record.student,
                id: record.student._id.toString(),
              }
            : null,
          class: record.class
            ? {
                ...record.class,
                id: record.class._id.toString(),
              }
            : null,
        }));
      } catch (error) {
        console.error("Error fetching attendance:", error);
        throw new Error("Failed to fetch attendance records");
      }
    },

    getAttendanceById: async (_, { id }) => {
      try {
        const record = await Attendance.findById(id)
          .populate("student")
          .populate("class")
          .lean();

        if (!record) {
          throw new Error("Attendance record not found");
        }

        return {
          ...record,
          id: record._id.toString(),
          student: record.student
            ? {
                ...record.student,
                id: record.student._id.toString(),
              }
            : null,
          class: record.class
            ? {
                ...record.class,
                id: record.class._id.toString(),
              }
            : null,
        };
      } catch (error) {
        console.error("Error fetching attendance by ID:", error);
        throw error;
      }
    },
  },

  Mutation: {
    addAttendance: async (_, { studentId, classId, status, date }) => {
      try {
        const newRecord = await Attendance.create({
          student: studentId,
          class: classId,
          status,
          date: date ? new Date(date) : new Date(),
        });

        const populated = await Attendance.findById(newRecord._id)
          .populate("student")
          .populate("class")
          .lean();

        return {
          ...populated,
          id: populated._id.toString(),
          student: populated.student
            ? {
                ...populated.student,
                id: populated.student._id.toString(),
              }
            : null,
          class: populated.class
            ? {
                ...populated.class,
                id: populated.class._id.toString(),
              }
            : null,
        };
      } catch (error) {
        console.error("Error adding attendance:", error);
        throw new Error("Failed to add attendance record");
      }
    },

    updateAttendance: async (_, { id, status, date }) => {
      try {
        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (date !== undefined) updateData.date = new Date(date);

        const updatedRecord = await Attendance.findByIdAndUpdate(
          id,
          updateData,
          {
            new: true,
            runValidators: true,
          }
        )
          .populate("student")
          .populate("class")
          .lean();

        if (!updatedRecord) {
          throw new Error("Attendance record not found for update.");
        }

        return {
          ...updatedRecord,
          id: updatedRecord._id.toString(),
          student: updatedRecord.student
            ? {
                ...updatedRecord.student,
                id: updatedRecord.student._id.toString(),
              }
            : null,
          class: updatedRecord.class
            ? {
                ...updatedRecord.class,
                id: updatedRecord.class._id.toString(),
              }
            : null,
        };
      } catch (error) {
        console.error("Error updating attendance:", error);
        throw error;
      }
    },

    deleteAttendance: async (_, { id }) => {
      try {
        const deletedRecord = await Attendance.findByIdAndDelete(id);
        if (!deletedRecord) {
          throw new Error("Attendance record not found for deletion.");
        }
        return "Attendance Record Deleted Successfully";
      } catch (error) {
        console.error("Error deleting attendance:", error);
        throw error;
      }
    },
  },
};
