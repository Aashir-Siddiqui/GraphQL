import { useMutation, useQuery } from "@apollo/client/react";
import { GET_TEACHERS } from "../graphql/queries/teacher.query";
import { DELETE_TEACHER } from "../graphql/mutations/teacher.mutation";
import { Link } from "react-router-dom";

const Teachers = () => {
  const { data, loading, error, refetch } = useQuery(GET_TEACHERS);

  const [deleteTeacher] = useMutation(DELETE_TEACHER, {
    onCompleted: () => refetch(),
    onError: (err) => alert(`Error deleting teacher: ${err.message}`),
  });

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      await deleteTeacher({ variables: { id } });
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading Teachers...</div>;
  if (error)
    return (
      <div className="text-red-600 p-4 bg-red-100 border border-red-300 rounded-lg mt-10">
        Error: {error.message}
      </div>
    );

  const teachers = data?.getTeachers || [];

  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-indigo-700">
          Teacher List
        </h1>
        <Link
          to="/add-teacher"
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 text-sm font-semibold"
        >
          + Add New Teacher
        </Link>
      </div>

      {teachers.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No teachers records found.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {teacher.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {teacher.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/teacher/${teacher.id}`}>
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                        View
                      </button>
                    </Link>
                    {/* ✅ EDIT BUTTON */}
                    <Link
                      to={`/edit-teacher/${teacher.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>

                    {/* ✅ DELETE BUTTON */}
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(teacher.id, teacher.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-center text-sm text-gray-400 mt-4">
        (CRUD functionality is now implemented.)
      </p>
    </div>
  );
};

export default Teachers;
