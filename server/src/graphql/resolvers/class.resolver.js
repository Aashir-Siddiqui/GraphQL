import Class from "../../models/Class.js";

export const classResolver = {
  Query: {
    getClasses: async () => {
      try {
        const classes = await Class.find().populate("teacher").lean();

        return classes
          .filter((cls) => cls.name && cls.classStartTime && cls.classEndTime)
          .map((cls) => ({
            ...cls,
            id: cls._id.toString(),
            teacher: cls.teacher
              ? {
                  ...cls.teacher,
                  id: cls.teacher._id.toString(),
                }
              : null,
          }));
      } catch (error) {
        console.error("Error fetching classes:", error);
        throw new Error("Failed to fetch classes");
      }
    },

    getClass: async (_, { id }) => {
      try {
        const cls = await Class.findById(id).populate("teacher").lean();

        if (!cls) {
          throw new Error("Class not found");
        }

        if (!cls.classStartTime || !cls.classEndTime) {
          throw new Error(
            "Class data is incomplete. Please update this class with start and end times."
          );
        }

        return {
          ...cls,
          id: cls._id.toString(),
          teacher: cls.teacher
            ? {
                ...cls.teacher,
                id: cls.teacher._id.toString(),
              }
            : null,
        };
      } catch (error) {
        console.error("Error fetching class:", error);
        throw error;
      }
    },
  },

  Mutation: {
    addClass: async (_, { name, classStartTime, classEndTime, teacherId }) => {
      try {
        const newClass = await Class.create({
          name,
          classStartTime,
          classEndTime,
          teacher: teacherId,
        });

        const populated = await Class.findById(newClass._id)
          .populate("teacher")
          .lean();

        return {
          ...populated,
          id: populated._id.toString(),
          teacher: populated.teacher
            ? {
                ...populated.teacher,
                id: populated.teacher._id.toString(),
              }
            : null,
        };
      } catch (error) {
        console.error("Error adding class:", error);
        throw new Error("Failed to add class");
      }
    },

    updatedClass: async (
      _,
      { id, name, classStartTime, classEndTime, teacherId }
    ) => {
      try {
        const updateData = {
          name,
          classStartTime,
          classEndTime,
          teacher: teacherId,
        };

        Object.keys(updateData).forEach(
          (key) => updateData[key] === undefined && delete updateData[key]
        );

        const updatedClass = await Class.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        })
          .populate("teacher")
          .lean();

        if (!updatedClass) {
          throw new Error("Class not found.");
        }

        return {
          ...updatedClass,
          id: updatedClass._id.toString(),
          teacher: updatedClass.teacher
            ? {
                ...updatedClass.teacher,
                id: updatedClass.teacher._id.toString(),
              }
            : null,
        };
      } catch (error) {
        console.error("Error updating class:", error);
        throw error;
      }
    },

    deleteClass: async (_, { id }) => {
      try {
        const deletedClass = await Class.findByIdAndDelete(id);
        if (!deletedClass) {
          throw new Error("Class not found for deletion.");
        }
        return "Class Deleted Successfully";
      } catch (error) {
        console.error("Error deleting class:", error);
        throw error;
      }
    },
  },
};
