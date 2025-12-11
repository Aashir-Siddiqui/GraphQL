import { gql } from "@apollo/client";

export const ADD_TEACHER = gql`
  mutation AddTeacher(
    $name: String!
    $email: String!
    $subject: String!
    $phone: String!
  ) {
    addTeacher(name: $name, email: $email, subject: $subject, phone: $phone) {
      id
      name
      subject
    }
  }
`;

export const UPDATE_TEACHER = gql`
  mutation UpdateTeacher(
    $id: ID!
    $name: String
    $email: String
    $subject: String
    $phone: String
  ) {
    updatedTeacher(
      id: $id
      name: $name
      email: $email
      subject: $subject
      phone: $phone
    ) {
      id
      name
      subject
    }
  }
`;

export const DELETE_TEACHER = gql`
  mutation DeleteTeacher($id: ID!) {
    deleteTeacher(id: $id)
  }
`;
