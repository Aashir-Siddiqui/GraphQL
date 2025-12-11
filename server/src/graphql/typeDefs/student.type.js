import { gql } from "graphql-tag";

export const studentType = gql`
  type Student {
    id: ID!
    name: String!
    email: String!
    rollNo: String!
    class: Class
  }

  type Query {
    getStudents: [Student]
    getStudent(id: ID!): Student
  }

  type Mutation {
    addStudent(
      name: String!
      email: String!
      rollNo: String!
      classId: ID!
    ): Student

    updatedStudent(
      id: ID!
      name: String
      email: String
      rollNo: String
      classId: ID
    ): Student

    deleteStudent(id: ID!): String
  }
`;
