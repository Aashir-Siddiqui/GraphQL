import { gql } from "@apollo/client";

export const GET_TEACHERS = gql`
  query GetTeachers {
    getTeachers {
      id
      name
      email
      subject
      phone
    }
  }
`;

export const GET_TEACHER = gql`
  query GetTeacher($id: ID!) {
    getTeacher(id: $id) {
      id
      name
      email
      subject
      phone
    }
  }
`;
