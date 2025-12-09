import { useQuery } from "@apollo/client";
import { GET_ATTENDANCE } from "../graphql/queries/attendance.query";

const Attendance = () => {
  const { data, loading, error } = useQuery(GET_ATTENDANCE);

  if (loading)
    return (
      <div className="text-center mt-10 text-lg">Loading Attendance...</div>
    );
  if (error)
    return (
      <div className="text-red-600 p-4 bg-red-100 border border-red-300 rounded-lg mt-10">
        Error: {error.message}
      </div>
    );

  const attendanceRecords = data?.getAttendance || [];

  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-4">
        Attendance Records
      </h1>

      {attendanceRecords.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No attendance records found.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.student?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {record.student?.rollNo || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {record.class?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      record.status === "PRESENT"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {record.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-center text-sm text-gray-400 mt-4">
        {" "}
        (Mark Attendance Form logic can be added here.)
      </p>
    </div>
  );
};

export default Attendance;
