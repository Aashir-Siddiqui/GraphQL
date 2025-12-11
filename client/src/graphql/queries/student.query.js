import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query GetStudents {
    getStudents {
      id
      name
      email
      rollNo
      class {
        id
        name
      }
    }
  }
`;

export const GET_STUDENT = gql`
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      id
      name
      email
      rollNo
      class {
        id
        name
      }
    }
  }
`;
