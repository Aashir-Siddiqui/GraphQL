import { gql } from "graphql-tag";

export const classType = gql`
  type Class {
    id: ID!
    name: String!
    classStartTime: String!
    classEndTime: String!
    teacher: Teacher
  }

  type Query {
    getClasses: [Class]
    getClass(id: ID!): Class
  }

  type Mutation {
    addClass(
      name: String!
      classStartTime: String!
      classEndTime: String!
      teacherId: ID!
    ): Class

    updatedClass(
      id: ID!
      name: String
      classStartTime: String
      classEndTime: String
      teacherId: ID
    ): Class

    deleteClass(id: ID!): String
  }
`;
