import Attendance from "../../models/Attendance.js";

export const attendanceResolver = {
  Query: {
    getAttendance: async () => {
      return await Attendance.find().populate("student").populate("class");
    },
  },

  Mutation: {
    markAttendance: async (_, { studentId, classId, status }) => {
      return await Attendance.create({
        student: studentId,
        class: classId,
        status,
      });
    },
  },
};
