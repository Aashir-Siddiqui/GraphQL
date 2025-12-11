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

    updatedTeacher: async (_, { id, name, email, subject, phone }) => {
      const updateData = { name, email, subject, phone };

      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updatedTeacher) {
        throw new Error("Teacher not found.");
      }
      return updatedTeacher;
    },

    deleteTeacher: async (_, { id }) => {
      const deleteTeacher = await Teacher.findByIdAndDelete(id);
      if (!deleteTeacher) {
        throw new Error("Teacher not found for deletion.");
      }
      return "Teacher Deleted Successfully";
    },
  },
};
