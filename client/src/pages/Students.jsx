import { useQuery } from "@apollo/client"; // 🎯 FIX: Corrected import path
import { GET_STUDENTS } from "../graphql/queries/student.query";
import { Link } from "react-router-dom"; // Add Link for navigation

const Students = () => {
  const { data, loading, error } = useQuery(GET_STUDENTS);

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading Students...</p>;
  if (error)
    return (
      <p className="text-red-600 p-4 bg-red-100 border border-red-300 rounded-lg mt-10">
        Error: {error.message}
      </p>
    ); // Improved error UI

  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-indigo-700">
          Student List
        </h1>
        {/* Button to navigate to Add Student form */}
        <Link
          to="/add-student"
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 text-sm font-semibold"
        >
          + Add New Student
        </Link>
      </div>

      {/* Improved Table UI */}
      <div className="overflow-x-auto shadow-xl rounded-lg mt-6">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.getStudents.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {student.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {student.rollNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {student.class?.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
