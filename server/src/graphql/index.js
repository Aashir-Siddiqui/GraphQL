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
import { attendanceType } from "./typeDefs/attendance.type.js";
import { attendanceResolver } from "./resolvers/attendance.resolver.js";

export const typeDefs = [studentType, teacherType, classType, attendanceType];

export const resolvers = [
  studentResolver,
  teacherResolver,
  classResolver,
  attendanceResolver,
];
