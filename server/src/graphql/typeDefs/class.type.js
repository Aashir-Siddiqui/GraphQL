import { gql } from "graphql-tag";

export const classType = gql`
  type Class {
    id: ID!
    name: String!
    teacher: Teacher
  }

  extend type Query {
    getClasses: [Class]
  }

  extend type Mutation {
    addClass(name: String!, teacherId: ID!): Class
  }
`;
