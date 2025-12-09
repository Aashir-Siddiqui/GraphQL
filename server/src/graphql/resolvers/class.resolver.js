import Class from "../../models/Class.js";

export const classResolver = {
  Query: {
    getClasses: async () => {
      return await Class.find().populate("teacher");
    },
  },

  Mutation: {
    addClass: async (_, { name, teacherId }) => {
      return await Class.create({
        name,
        teacher: teacherId,
      });
    },
  },
};
