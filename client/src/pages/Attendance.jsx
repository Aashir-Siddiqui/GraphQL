import { useQuery, useMutation } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";
import { GET_ATTENDANCE } from "../graphql/queries/attendance.query";
import { DELETE_ATTENDANCE, UPDATE_ATTENDANCE } from "../graphql/mutations/attendance.mutation";
import { useState } from "react";

const Attendance = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_ATTENDANCE);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ status: "", date: "" });

  const [deleteAttendance, { loading: deleteLoading }] = useMutation(DELETE_ATTENDANCE, {
    refetchQueries: [{ query: GET_ATTENDANCE }],
    onCompleted: () => alert("✅ Attendance Record Deleted Successfully!"),
    onError: (error) => alert(`❌ Deletion Failed: ${error.message}`),
  });

  const [updateAttendance, { loading: updateLoading }] = useMutation(UPDATE_ATTENDANCE, {
    refetchQueries: [{ query: GET_ATTENDANCE }],
    onCompleted: () => {
      alert("✅ Attendance Updated Successfully!");
      setEditingId(null);
    },
    onError: (error) => alert(`❌ Update Failed: ${error.message}`),
  });

  const handleDelete = (id, studentName) => {
    if (window.confirm(`⚠️ Delete attendance record for ${studentName}?\n\nThis action cannot be undone.`)) {
      deleteAttendance({ variables: { id } });
    }
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setEditForm({
      status: record.status,
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ status: "", date: "" });
  };

  const saveEdit = async (id) => {
    try {
      await updateAttendance({
        variables: {
          id,
          status: editForm.status,
          date: editForm.date,
        },
      });
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">Loading Attendance Records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <div className="flex items-center">
              <svg className="w-10 h-10 text-red-600 mr-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-xl font-bold text-red-800">Error Loading Attendance</h3>
                <p className="text-red-600 mt-2">{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const attendanceRecords = data?.getAttendance || [];

  // Calculate stats
  const totalRecords = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(r => r.status === "PRESENT").length;
  const absentCount = attendanceRecords.filter(r => r.status === "ABSENT").length;
  const leaveCount = attendanceRecords.filter(r => r.status === "LEAVE").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "PRESENT": return "bg-green-100 text-green-800 border-green-300";
      case "ABSENT": return "bg-red-100 text-red-800 border-red-300";
      case "LEAVE": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mr-4">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-white">Attendance Records</h1>
                  <p className="mt-2 text-indigo-100 text-lg">{totalRecords} Total Records</p>
                </div>
              </div>
              
              <Link
                to="/mark-attendance"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-bold rounded-xl text-white bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Mark Attendance
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Records</p>
                    <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-lg p-3">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Present</p>
                    <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-red-100 rounded-lg p-3">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Absent</p>
                    <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-lg p-3">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">On Leave</p>
                    <p className="text-2xl font-bold text-gray-900">{leaveCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {attendanceRecords.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Attendance Records</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Start marking attendance to track student presence!</p>
            <Link
              to="/mark-attendance"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Mark First Attendance
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.map((record, index) => (
                    <tr key={record.id} className={`hover:bg-indigo-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === record.id ? (
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className="border border-indigo-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold">{record.student?.name?.charAt(0) || "?"}</span>
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">{record.student?.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.student?.rollNo || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.class?.name || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === record.id ? (
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            className="border border-indigo-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LEAVE">Leave</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === record.id ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => saveEdit(record.id)}
                              disabled={updateLoading}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-bold rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => startEdit(record)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(record.id, record.student?.name)}
                              disabled={deleteLoading}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;