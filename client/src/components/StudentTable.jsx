import React from "react";
import { DELETE_STUDENT } from "../graphql/mutations/student.mutation";
import { GET_STUDENTS } from "../graphql/queries/student.query";
import { useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";

const StudentTable = ({ students }) => {
  const [deleteStudent] = useMutation(DELETE_STUDENT, {
    refetchQueries: [{ query: GET_STUDENTS }],
    onCompleted: () => alert("Student Deleted Successfully!"),
    onError: (error) => alert(`Deletion Failed: ${error.message}`),
  });

  return (
    <div className="overflow-x-auto shadow-xl rounded-lg mt-6">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="...">Roll No</th>
            <th className="...">Name</th>
            <th className="...">Email</th>
            <th className="...">Class</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map((student) => (
            <tr
              key={student.id}
              className="hover:bg-gray-50 transition duration-150"
            >
              {/* ... Student Data Cells ... */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {student.rollNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {student.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {student.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {student.class?.name || "N/A"}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link to={`/student/${student.id}`}>
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    View
                  </button>
                </Link>

                <Link to={`/edit-student/${student.id}`}>
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    Update
                  </button>
                </Link>

                <button
                  className="text-red-600 hover:text-red-900 mr-4"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete ${student.name}?`
                      )
                    ) {
                      deleteStudent({ variables: { id: student.id } });
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
