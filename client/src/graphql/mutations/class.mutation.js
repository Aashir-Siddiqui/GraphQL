import { gql } from "@apollo/client";

export const ADD_CLASS = gql`
  mutation AddClass(
    $name: String!
    $classStartTime: String!
    $classEndTime: String!
    $teacherId: ID!
  ) {
    addClass(
      name: $name
      classStartTime: $classStartTime
      classEndTime: $classEndTime
      teacherId: $teacherId
    ) {
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

export const UPDATE_CLASS = gql`
  mutation UpdateClass(
    $id: ID!
    $name: String
    $classStartTime: String
    $classEndTime: String
    $teacherId: ID
  ) {
    updatedClass(
      id: $id
      name: $name
      classStartTime: $classStartTime
      classEndTime: $classEndTime
      teacherId: $teacherId
    ) {
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

export const DELETE_CLASS = gql`
  mutation DeleteClass($id: ID!) {
    deleteClass(id: $id)
  }
`;
