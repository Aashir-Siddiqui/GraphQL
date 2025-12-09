import { useMutation, useQuery } from "@apollo/client";
import { ADD_STUDENT } from "../graphql/mutations/student.mutation";
import { GET_STUDENTS } from "../graphql/queries/student.query";
import { GET_CLASSES } from "../graphql/queries/class.query"; // Import Class Query
import { useState } from "react";

const StudentForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNo: "",
    classId: "",
  });

  const { data: classesData, loading: classesLoading } = useQuery(GET_CLASSES);

  const [addStudent, { loading: mutationLoading, error: mutationError }] =
    useMutation(ADD_STUDENT, {
      refetchQueries: [GET_STUDENTS], // Refresh student list
    });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!form.classId) return alert("Please select a Class.");
    try {
      await addStudent({ variables: form });
      setForm({ name: "", email: "", rollNo: "", classId: "" });
    } catch (error) {
      console.error("Error adding student:", error);
      // Error will be shown via mutationError
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const classes = classesData?.getClasses || [];

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Add New Student
      </h2>
      {mutationError && (
        <p className="text-red-500 mb-4">Error: {mutationError.message}</p>
      )}

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Student Name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="rollNo"
            className="block text-sm font-medium text-gray-700"
          >
            Roll No
          </label>
          <input
            id="rollNo"
            name="rollNo"
            placeholder="Roll Number"
            value={form.rollNo}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="classId"
            className="block text-sm font-medium text-gray-700"
          >
            Class
          </label>
          <select
            id="classId"
            name="classId"
            value={form.classId}
            onChange={handleChange}
            required
            disabled={classesLoading}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="">
              {classesLoading ? "Loading Classes..." : "Select a Class"}
            </option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={mutationLoading}
          className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {mutationLoading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
