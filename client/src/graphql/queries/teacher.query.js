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
