import { gql } from "@apollo/client";

export const GET_CLASSES = gql`
  query GetClasses {
    getClasses {
      id
      name
      classStartTime
      classEndTime
      teacher {
        id
        name
      }
    }
  }
`;

export const GET_CLASS = gql`
  query GetClass($id: ID!) {
    getClass(id: $id) {
      id
      name
      classStartTime
      classEndTime
      teacher {
        id
        name
      }
    }
  }
`;
