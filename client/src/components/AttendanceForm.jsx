import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { GET_CLASSES } from "../graphql/queries/class.query";
import { GET_STUDENTS } from "../graphql/queries/student.query";
import { ADD_ATTENDANCE } from "../graphql/mutations/attendance.mutation";
import { GET_ATTENDANCE } from "../graphql/queries/attendance.query";

const AttendanceForm = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch classes and students
  const { data: classesData, loading: classesLoading } = useQuery(GET_CLASSES);
  const { data: studentsData, loading: studentsLoading } =
    useQuery(GET_STUDENTS);

  const [addAttendance, { loading: submitting }] = useMutation(ADD_ATTENDANCE, {
    refetchQueries: [{ query: GET_ATTENDANCE }],
  });

  const classes = classesData?.getClasses || [];
  const allStudents = studentsData?.getStudents || [];

  // Filter students by selected class
  const studentsInClass = selectedClass
    ? allStudents.filter((student) => student.class?.id === selectedClass)
    : [];

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClass) {
      return alert("Please select a class.");
    }

    if (Object.keys(attendanceData).length === 0) {
      return alert("Please mark attendance for at least one student.");
    }

    try {
      const promises = Object.entries(attendanceData).map(
        ([studentId, status]) =>
          addAttendance({
            variables: {
              studentId,
              classId: selectedClass,
              status,
              date: selectedDate,
            },
          })
      );

      await Promise.all(promises);
      setShowSuccessModal(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        setAttendanceData({});
        setSelectedClass("");
      }, 2000);
    } catch (err) {
      console.error("Error:", err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const handleMarkAll = (status) => {
    const newData = {};
    studentsInClass.forEach((student) => {
      newData[student.id] = status;
    });
    setAttendanceData(newData);
  };

  // Calculate statistics
  const markedCount = Object.keys(attendanceData).length;
  const presentCount = Object.values(attendanceData).filter(
    (s) => s === "PRESENT"
  ).length;
  const absentCount = Object.values(attendanceData).filter(
    (s) => s === "ABSENT"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/attendance")}
          className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors group"
        >
          <svg
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Attendance Records
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 mr-5">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-4xl font-extrabold text-white">
                    Mark Attendance
                  </h2>
                  <p className="mt-2 text-blue-100 text-lg">
                    Select class and mark student attendance
                  </p>
                </div>
              </div>

              {/* Date Badge */}
              <div className="hidden md:block bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white border-opacity-30">
                <p className="text-blue-100 text-sm font-medium">
                  Today's Date
                </p>
                <p className="text-white text-xl font-bold">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-10 space-y-8">
            {/* Class and Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Selection */}
              <div className="space-y-2">
                <label
                  htmlFor="class"
                  className="block text-sm font-bold text-gray-800 uppercase tracking-wide"
                >
                  Select Class
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <svg
                      className="h-6 w-6 text-indigo-400 group-focus-within:text-indigo-600 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                    </svg>
                  </div>
                  <select
                    id="class"
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setAttendanceData({});
                    }}
                    disabled={classesLoading}
                    className="block w-full pl-14 pr-10 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 bg-white transition-all appearance-none cursor-pointer disabled:opacity-50"
                    required
                  >
                    <option value="">
                      {classesLoading ? "Loading classes..." : "Choose a class"}
                    </option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - {cls.teacher?.name || "No Teacher"}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="block text-sm font-bold text-gray-800 uppercase tracking-wide"
                >
                  Attendance Date
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-6 w-6 text-purple-400 group-focus-within:text-purple-600 transition-colors"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            {selectedClass && studentsInClass.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-indigo-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Total Students
                    </p>
                    <p className="text-3xl font-bold text-indigo-600 mt-1">
                      {studentsInClass.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Marked
                    </p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      {markedCount}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Present
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      {presentCount}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Absent
                    </p>
                    <p className="text-3xl font-bold text-red-600 mt-1">
                      {absentCount}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {selectedClass && studentsInClass.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                    Quick Actions
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleMarkAll("PRESENT")}
                    className="inline-flex items-center px-6 py-3 border-2 border-green-500 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Mark All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkAll("ABSENT")}
                    className="inline-flex items-center px-6 py-3 border-2 border-red-500 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Mark All Absent
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendanceData({})}
                    className="inline-flex items-center px-6 py-3 border-2 border-gray-400 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all shadow hover:shadow-lg"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Students List */}
            {selectedClass && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center border-b-2 border-gray-200 pb-3">
                  <div className="bg-indigo-100 rounded-xl p-2 mr-3">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  Students in Class ({studentsInClass.length})
                </h3>

                {studentsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                      <p className="mt-4 text-gray-600 font-medium">
                        Loading students...
                      </p>
                    </div>
                  </div>
                ) : studentsInClass.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                    <svg
                      className="mx-auto h-16 w-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <p className="mt-4 text-xl text-gray-500 font-semibold">
                      No students enrolled in this class
                    </p>
                    <p className="text-gray-400 mt-2">
                      Please add students to this class first
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {studentsInClass.map((student, index) => (
                      <div
                        key={student.id}
                        className={`group flex items-center justify-between p-6 bg-white border-2 rounded-2xl transition-all hover:shadow-xl ${
                          attendanceData[student.id] === "PRESENT"
                            ? "border-green-400 bg-green-50"
                            : attendanceData[student.id] === "ABSENT"
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 hover:border-indigo-300"
                        }`}
                      >
                        <div className="flex items-center space-x-5">
                          {/* Serial Number */}
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {index + 1}
                            </span>
                          </div>

                          {/* Avatar */}
                          <div className="flex-shrink-0 h-14 w-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-xl">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>

                          {/* Student Info */}
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">
                              {student.name}
                            </h4>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Roll No:{" "}
                              <span className="font-semibold ml-1">
                                {student.rollNo}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleAttendanceChange(student.id, "PRESENT")
                            }
                            className={`inline-flex items-center px-6 py-3 border-2 text-sm font-bold rounded-xl transition-all transform hover:scale-105 ${
                              attendanceData[student.id] === "PRESENT"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-xl scale-105"
                                : "bg-white text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400 shadow"
                            }`}
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAttendanceChange(student.id, "ABSENT")
                            }
                            className={`inline-flex items-center px-6 py-3 border-2 text-sm font-bold rounded-xl transition-all transform hover:scale-105 ${
                              attendanceData[student.id] === "ABSENT"
                                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500 shadow-xl scale-105"
                                : "bg-white text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400 shadow"
                            }`}
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Absent
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            {selectedClass && studentsInClass.length > 0 && (
              <div className="flex justify-end pt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={
                    submitting || Object.keys(attendanceData).length === 0
                  }
                  className="inline-flex items-center justify-center px-12 py-5 border border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-7 w-7 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting Attendance...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-7 h-7 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Submit Attendance ({markedCount}/{studentsInClass.length})
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform animate-bounce">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-12 w-12 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Attendance Submitted!
                </h3>
                <p className="text-gray-600 mb-6">
                  The attendance has been successfully recorded.
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="inline-flex items-center px-6 py-3 border-2 border-indigo-600 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all shadow-lg hover:shadow-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceForm;
