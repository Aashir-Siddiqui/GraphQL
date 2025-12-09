import Teacher from "../../models/Teacher.js";

export const teacherResolver = {
  Query: {
    getTeachers: async () => {
      return await Teacher.find();
    },

    getTeacher: async (_, { id }) => {
      return await Teacher.findById(id);
    },
  },

  Mutation: {
    addTeacher: async (_, args) => {
      const teacher = new Teacher(args);
      return await teacher.save();
    },

    deleteTeacher: async (_, { id }) => {
      await Teacher.findByIdAndDelete(id);
      return "✅ Teacher Deleted Successfully";
    },
  },
};
