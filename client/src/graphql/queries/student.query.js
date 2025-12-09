import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query {
    getStudents {
      id
      name
      email
      rollNo
      class {
        name
      }
    }
  }
`;
