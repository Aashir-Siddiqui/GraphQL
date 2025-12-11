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
      rollNo
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: ID!
    $name: String
    $email: String
    $rollNo: String
    $classId: ID
  ) {
    updatedStudent(
      id: $id
      name: $name
      email: $email
      rollNo: $rollNo
      classId: $classId
    ) {
      id
      name
      rollNo
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`;
