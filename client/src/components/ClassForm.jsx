import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { ADD_CLASS, UPDATE_CLASS } from "../graphql/mutations/class.mutation";
import { GET_CLASSES, GET_CLASS } from "../graphql/queries/class.query";
import { GET_TEACHERS } from "../graphql/queries/teacher.query";

const ClassForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [form, setForm] = useState({
    name: "",
    classStartTime: "",
    classEndTime: "",
    teacherId: "",
  });

  // Fetch teachers for dropdown
  const { data: teachersData, loading: teachersLoading } =
    useQuery(GET_TEACHERS);
  const teachers = teachersData?.getTeachers || [];

  // Fetch existing class data in edit mode
  const { data: classData, loading: classLoading } = useQuery(GET_CLASS, {
    variables: { id },
    skip: !isEditMode,
  });

  useEffect(() => {
    if (isEditMode && classData?.getClass) {
      const cls = classData.getClass;
      setForm({
        name: cls.name,
        classStartTime: cls.classStartTime,
        classEndTime: cls.classEndTime,
        teacherId: cls.teacher?.id || "",
      });
    }
  }, [isEditMode, classData]);

  // Mutations
  const [addClass, { loading: addLoading }] = useMutation(ADD_CLASS, {
    refetchQueries: [{ query: GET_CLASSES }],
  });

  const [updateClass, { loading: updateLoading }] = useMutation(UPDATE_CLASS, {
    refetchQueries: [{ query: GET_CLASSES }],
  });

  const loading = classLoading || addLoading || updateLoading;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.teacherId) {
      return alert("Please select a teacher.");
    }

    try {
      if (isEditMode) {
        await updateClass({ variables: { id, ...form } });
        alert("Class updated successfully!");
      } else {
        await addClass({ variables: form });
        alert("Class added successfully!");
      }
      navigate("/classes");
    } catch (err) {
      console.error("Error:", err.message);
      alert(`Error: ${err.message}`);
    }
  };

  if (isEditMode && classLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">
            Loading class data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/classes")}
          className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Classes
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mr-4">
                <svg
                  className="w-10 h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h2 className="text-4xl font-extrabold text-white">
                  {isEditMode ? "Edit Class" : "Create New Class"}
                </h2>
                <p className="mt-2 text-indigo-100 text-lg">
                  {isEditMode
                    ? "Update class information below"
                    : "Fill in the details to create a new class"}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="px-8 py-10 space-y-8">
            {/* Class Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-bold text-gray-800 uppercase tracking-wide"
              >
                Class Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-6 w-6 text-indigo-400 group-focus-within:text-indigo-600 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Mathematics 101, Physics Advanced"
                  className="block w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Teacher Selection */}
            <div className="space-y-2">
              <label
                htmlFor="teacherId"
                className="block text-sm font-bold text-gray-800 uppercase tracking-wide"
              >
                Assign Teacher
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <svg
                    className="h-6 w-6 text-purple-400 group-focus-within:text-purple-600 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <select
                  id="teacherId"
                  name="teacherId"
                  value={form.teacherId}
                  onChange={handleChange}
                  required
                  disabled={teachersLoading}
                  className="block w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 bg-white transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {teachersLoading
                      ? "Loading teachers..."
                      : "Select a teacher"}
                  </option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}{" "}
                      {teacher.subject &&
                        `- ${
                          Array.isArray(teacher.subject)
                            ? teacher.subject.join(", ")
                            : teacher.subject
                        }`}
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
              {teachersLoading && (
                <p className="text-sm text-gray-500 flex items-center mt-2">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-indigo-600"
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
                  Fetching teachers...
                </p>
              )}
            </div>

            {/* Time Inputs */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Class Timing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <div className="space-y-2">
                  <label
                    htmlFor="classStartTime"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Start Time
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-6 w-6 text-green-500 group-focus-within:text-green-600 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      id="classStartTime"
                      name="classStartTime"
                      type="time"
                      value={form.classStartTime}
                      onChange={handleChange}
                      required
                      className="block w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <label
                    htmlFor="classEndTime"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    End Time
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-6 w-6 text-red-500 group-focus-within:text-red-600 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      id="classEndTime"
                      name="classEndTime"
                      type="time"
                      value={form.classEndTime}
                      onChange={handleChange}
                      required
                      className="block w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-200 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-8 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/classes")}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-lg font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all"
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
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {isEditMode ? "Update Class" : "Create Class"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Card */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-blue-800">
                Need Help?
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Make sure to select a valid teacher and set appropriate class
                timings. The end time should be after the start time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassForm;
