import { useMutation, useQuery } from "@apollo/client/react";
import {
  ADD_STUDENT,
  UPDATE_STUDENT,
} from "../graphql/mutations/student.mutation";
import { GET_STUDENTS, GET_STUDENT } from "../graphql/queries/student.query";
import { GET_CLASSES } from "../graphql/queries/class.query";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 

const StudentForm = () => {
  const navigate = useNavigate();
  const { id: studentId } = useParams();
  const isEditMode = !!studentId;

  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNo: "",
    classId: "",
  });

  // Classes data fetch karein
  const { data: classesData, loading: classesLoading } = useQuery(GET_CLASSES);
  const classes = classesData?.getClasses || [];

  // ✅ EDIT MODE: Existing Student data fetch karein
  const { data: studentData, loading: studentLoading } = useQuery(GET_STUDENT, {
    variables: { id: studentId },
    skip: !isEditMode, // Sirf Edit Mode mein chalao
  });

  // ✅ EFFECT: Jab student data fetch ho jaaye, toh form ko pre-fill karein
  useEffect(() => {
    if (isEditMode && studentData?.getStudent) {
      const student = studentData.getStudent;
      setForm({
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
        classId: student.class?.id || "", // Existing class ID set karein
      });
    }
  }, [isEditMode, studentData]);

  // Mutations (Dono ke liye hooks set karein)
  const [addStudent, { loading: addLoading }] = useMutation(ADD_STUDENT, {
    refetchQueries: [{ query: GET_STUDENTS }],
  });

  const [updateStudent, { loading: updateLoading }] = useMutation(
    UPDATE_STUDENT,
    {
      refetchQueries: [{ query: GET_STUDENTS }],
    }
  );

  const mutationLoading = addLoading || updateLoading;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!form.classId) return alert("Please select a Class.");

    try {
      if (isEditMode) {
        // ✅ UPDATE LOGIC
        await updateStudent({
          variables: { id: studentId, ...form },
        });
        alert("Student Updated Successfully!");
      } else {
        // ✅ ADD LOGIC
        await addStudent({ variables: form });
        alert("Student Added Successfully!");
      }
      navigate("/students"); // Success par list page par wapas le jayen
    } catch (error) {
      console.error("Mutation Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (isEditMode && studentLoading)
    return (
      <div className="text-center mt-10 text-lg">Loading Student Data...</div>
    );

  const formTitle = isEditMode ? "Update Student" : "Add New Student";
  const submitButtonText = isEditMode ? "Save Changes" : "Add Student";

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-2xl mt-10">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-4">
        {formTitle}
      </h2>
      <form onSubmit={submitHandler} className="space-y-6">
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
          className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
        >
          {mutationLoading ? "Processing..." : submitButtonText}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
