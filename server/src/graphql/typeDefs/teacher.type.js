import { gql } from "graphql-tag";

export const teacherType = gql`
  type Teacher {
    id: ID!
    name: String!
    email: String!
    subject: [String!]!
    phone: String!
  }

  type Query {
    getTeachers: [Teacher]
    getTeacher(id: ID!): Teacher
  }

  type Mutation {
    addTeacher(
      name: String!
      email: String!
      subject: [String!]!
      phone: String!
    ): Teacher

    updatedTeacher(
      id: ID!
      name: String
      email: String
      subject: [String!]
      phone: String
    ): Teacher
    deleteTeacher(id: ID!): String
  }
`;
