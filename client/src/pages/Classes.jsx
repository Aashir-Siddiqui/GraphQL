import { useQuery } from "@apollo/client";
import { GET_CLASSES } from "../graphql/queries/class.query";

const Classes = () => {
  const { data, loading, error } = useQuery(GET_CLASSES);

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading Classes...</div>;
  if (error)
    return (
      <div className="text-red-600 p-4 bg-red-100 border border-red-300 rounded-lg mt-10">
        Error: {error.message}
      </div>
    );

  const classes = data?.getClasses || [];

  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-4">
        Class List
      </h1>

      {classes.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No class records found.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Teacher
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classes.map((cls) => (
                <tr
                  key={cls.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cls.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {cls.teacher?.name || "Unassigned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-center text-sm text-gray-400 mt-4">
        {" "}
        (Add Class form and assignment logic can be added here.)
      </p>
    </div>
  );
};

export default Classes;
