import Student from "../../models/Student.js";
import Attendance from "../../models/Attendance.js";

export const studentResolver = {
  Query: {
    getStudents: async () => {
      try {
        const students = await Student.find().populate("class").lean();
        return students.map((student) => ({
          ...student,
          id: student._id.toString(),
          class: student.class
            ? {
                ...student.class,
                id: student.class._id.toString(),
              }
            : null,
        }));
      } catch (error) {
        console.error("Error fetching students:", error);
        throw new Error("Failed to fetch students");
      }
    },

    getStudent: async (_, { id }) => {
      try {
        const student = await Student.findById(id).populate("class").lean();
        if (!student) {
          throw new Error("Student not found");
        }
        return {
          ...student,
          id: student._id.toString(),
          class: student.class
            ? {
                ...student.class,
                id: student.class._id.toString(),
              }
            : null,
        };
      } catch (error) {
        console.error("Error fetching student:", error);
        throw error;
      }
    },
  },

  Mutation: {
    addStudent: async (_, { name, email, rollNo, classId }) => {
      try {
        const existingStudent = await Student.findOne({ rollNo });
        if (existingStudent) {
          throw new Error(
            `Roll number ${rollNo} is already taken. Please use a unique roll number.`
          );
        }

        const existingEmail = await Student.findOne({ email });
        if (existingEmail) {
          throw new Error(`Email ${email} is already registered.`);
        }

        const newStudent = await Student.create({
          name,
          email,
          rollNo,
          class: classId,
        });

        const populated = await Student.findById(newStudent._id)
          .populate("class")
          .lean();

        return {
          ...populated,
          id: populated._id.toString(),
          class: populated.class
            ? {
                ...populated.class,
                id: populated.class._id.toString(),
              }
            : null,
        };
      } catch (error) {
        console.error("Error adding student:", error);
        throw error;
      }
    },

    updatedStudent: async (_, { id, name, email, rollNo, classId }) => {
      try {
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (rollNo !== undefined) updateData.rollNo = rollNo;
        if (classId !== undefined) updateData.class = classId;

        if (rollNo !== undefined) {
          const existingStudent = await Student.findOne({
            rollNo,
            _id: { $ne: id },
          });
          if (existingStudent) {
            throw new Error(
              `Roll number ${rollNo} is already taken by another student.`
            );
          }
        }

        if (email !== undefined) {
          const existingEmail = await Student.findOne({
            email,
            _id: { $ne: id },
          });
          if (existingEmail) {
            throw new Error(
              `Email ${email} is already registered to another student.`
            );
          }
        }

        const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        })
          .populate("class")
          .lean();

        if (!updatedStudent) {
          throw new Error("Student not found.");
        }

        return {
          ...updatedStudent,
          id: updatedStudent._id.toString(),
          class: updatedStudent.class
            ? {
                ...updatedStudent.class,
                id: updatedStudent.class._id.toString(),
              }
            : null,
        };
      } catch (error) {
        console.error("Error updating student:", error);
        throw error;
      }
    },

    deleteStudent: async (_, { id }) => {
      try {
        const attendanceDeleteResult = await Attendance.deleteMany({
          student: id,
        });
        console.log(
          `Deleted ${attendanceDeleteResult.deletedCount} attendance records for student ${id}`
        );

        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
          throw new Error("Student not found for deletion.");
        }

        return `Student "${deletedStudent.name}" and ${attendanceDeleteResult.deletedCount} related attendance records deleted successfully`;
      } catch (error) {
        console.error("Error deleting student:", error);
        throw error;
      }
    },
  },
};
