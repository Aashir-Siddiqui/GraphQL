import { gql } from "@apollo/client";

export const GET_CLASSES = gql`
  query GetClasses {
    getClasses {
      id
      name
      teacher {
        id
        name # Fetching teacher name
      }
    }
  }
`;
