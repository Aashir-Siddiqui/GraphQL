// ✅ Student
import { studentType } from "./typeDefs/student.type.js";
import { studentResolver } from "./resolvers/student.resolver.js";

// ✅ Teacher
import { teacherType } from "./typeDefs/teacher.type.js";
import { teacherResolver } from "./resolvers/teacher.resolver.js";

// ✅ Class
import { classType } from "./typeDefs/class.type.js";
import { classResolver } from "./resolvers/class.resolver.js";

// ✅ Attendance
// Note: Changed import name to match the array export
import { attendanceTypes } from "./typeDefs/attendance.type.js";
import { attendanceResolver } from "./resolvers/attendance.resolver.js";

// ✅ UPDATED: attendanceTypes array ko spread operator (...) se include kiya gaya hai
export const typeDefs = [
  studentType,
  teacherType,
  classType,
  ...attendanceTypes, // Spreading the Enum and Type
];

export const resolvers = [
  studentResolver,
  teacherResolver,
  classResolver,
  attendanceResolver,
];
