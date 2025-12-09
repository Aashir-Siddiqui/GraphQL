import { gql } from "@apollo/client";

export const MARK_ATTENDANCE = gql`
  mutation MarkAttendance($studentId: ID!, $classId: ID!, $status: String!) {
    markAttendance(studentId: $studentId, classId: $classId, status: $status) {
      id
      status
      student {
        name
      }
    }
  }
`;
