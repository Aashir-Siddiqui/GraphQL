import { useQuery } from "@apollo/client";
import { GET_TEACHERS } from "../graphql/queries/teacher.query";

const Teachers = () => {
  const { data, loading, error } = useQuery(GET_TEACHERS);

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
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-4">
        Teacher List
      </h1>

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-center text-sm text-gray-400 mt-4">
        {" "}
        (Add Teacher form and Delete button logic can be added here.)
      </p>
    </div>
  );
};

export default Teachers;
