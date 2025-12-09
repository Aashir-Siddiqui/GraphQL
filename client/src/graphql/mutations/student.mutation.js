import { gql } from "@apollo/client";

export const ADD_STUDENT = gql`
  mutation AddStudent(
    $name: String!
    $email: String!
    $rollNo: String!
    $classId: ID!
  ) {
    addStudent(name: $name, email: $email, rollNo: $rollNo, classId: $classId) {
      id
      name
    }
  }
`;
