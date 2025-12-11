import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { GET_TEACHER } from "../graphql/queries/teacher.query";

const TeacherDetails = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_TEACHER, {
    variables: { id },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data.getTeacher) return <ErrorMessage message="Teacher not found." />;

  const { getTeacher: teacher } = data;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-2 pb-2 border-indigo-500">
          {teacher.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-lg text-gray-700">
          <p>
            <strong className="font-semibold text-gray-800">Age:</strong>{" "}
            {teacher.age}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Gender:</strong>{" "}
            {teacher.gender}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Email:</strong>{" "}
            <a
              href={`mailto:${teacher.email}`}
              className="text-blue-600 hover:underline"
            >
              {teacher.email}
            </a>
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Phone:</strong>{" "}
            <a
              href={`tel:${teacher.phone}`}
              className="text-blue-600 hover:underline"
            >
              {teacher.phone}
            </a>
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Class:</strong>{" "}
            {teacher.subject}
          </p>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Link
            to="/teachers"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H16a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Teachers
          </Link>
          {/* Add Edit Student button if needed */}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
