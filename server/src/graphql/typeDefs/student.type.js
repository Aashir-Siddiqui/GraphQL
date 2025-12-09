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
  }

  type Mutation {
    addStudent(
      name: String!
      email: String!
      rollNo: String!
      classId: ID!
    ): Student
  }
`;
