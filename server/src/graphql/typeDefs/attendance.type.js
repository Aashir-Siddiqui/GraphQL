import { gql } from "graphql-tag";

export const attendanceType = gql`
  type Attendance {
    id: ID!
    student: Student
    class: Class
    status: String
    date: String
  }

  extend type Query {
    getAttendance: [Attendance]
  }

  extend type Mutation {
    markAttendance(studentId: ID!, classId: ID!, status: String!): Attendance
  }
`;
