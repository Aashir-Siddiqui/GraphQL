import Student from "../../models/Student.js";

export const studentResolver = {
  Query: {
    getStudents: async () => {
      return await Student.find().populate("class");
    },
  },

  Mutation: {
    addStudent: async (_, { name, email, rollNo, classId }) => {
      return await Student.create({
        name,
        email,
        rollNo,
        class: classId,
      });
    },
  },
};
