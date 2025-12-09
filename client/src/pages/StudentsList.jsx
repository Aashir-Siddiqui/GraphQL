import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_STUDENTS } from "../graphql/queries";
import { DELETE_STUDENT } from "../graphql/mutations";
import StudentCard from "../components/StudentCard";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner"; // Next, we'll create this
import ErrorMessage from "../components/ErrorMessage"; // Next, we'll create this

const StudentsList = () => {
  const { loading, error, data, refetch } = useQuery(GET_STUDENTS);
  const [deleteStudent] = useMutation(DELETE_STUDENT, {
    onCompleted: () => refetch(), // Refresh the list after deletion
    onError: (err) => console.error("Error deleting student:", err.message),
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudent({ variables: { id } });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Our Students</h2>
        <Link
          to="/add-student"
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New Student
        </Link>
      </div>

      {data.getStudents.length === 0 ? (
        <p className="text-gray-600 text-center text-lg mt-10">
          No students found. Add one!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.getStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentsList;
