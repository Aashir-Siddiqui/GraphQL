import { gql } from "graphql-tag";

const AttendanceStatus = gql`
  enum AttendanceStatus {
    PRESENT
    ABSENT
    LEAVE
  }
`;

export const attendanceType = gql`
  type Attendance {
    id: ID!
    student: Student
    class: Class
    status: AttendanceStatus!
    date: String
  }

  extend type Query {
    getAttendance: [Attendance]
    getAttendanceById(id: ID!): Attendance
  }

  extend type Mutation {
    addAttendance(
      studentId: ID!
      classId: ID!
      status: AttendanceStatus!
      date: String
    ): Attendance

    updateAttendance(
      id: ID!
      status: AttendanceStatus
      date: String
    ): Attendance

    deleteAttendance(id: ID!): String
  }
`;

export const attendanceTypes = [AttendanceStatus, attendanceType];
