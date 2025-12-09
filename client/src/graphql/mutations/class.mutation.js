import { gql } from "@apollo/client";

export const ADD_CLASS = gql`
  mutation AddClass($name: String!, $teacherId: ID!) {
    addClass(name: $name, teacherId: $teacherId) {
      id
      name
    }
  }
`;
