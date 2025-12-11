import { gql } from "@apollo/client";

export const ADD_ATTENDANCE = gql`
  mutation AddAttendance(
    $studentId: ID!
    $classId: ID!
    $status: AttendanceStatus!
    $date: String
  ) {
    addAttendance(
      studentId: $studentId
      classId: $classId
      status: $status
      date: $date
    ) {
      id
      status
      date
      student {
        id
        name
        rollNo
      }
      class {
        id
        name
      }
    }
  }
`;

export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance(
    $id: ID!
    $status: AttendanceStatus
    $date: String
  ) {
    updateAttendance(id: $id, status: $status, date: $date) {
      id
      status
      date
      student {
        id
        name
      }
      class {
        id
        name
      }
    }
  }
`;

export const DELETE_ATTENDANCE = gql`
  mutation DeleteAttendance($id: ID!) {
    deleteAttendance(id: $id)
  }
`;
