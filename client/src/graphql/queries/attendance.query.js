import { gql } from "@apollo/client";

export const GET_ATTENDANCE = gql`
  query GetAttendance {
    getAttendance {
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
