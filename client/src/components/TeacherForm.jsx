import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

const GET_TEACHER = gql`
  query GetTeacher($id: ID!) {
    getTeacher(id: $id) {
      id
      name
      email
      subject
      phone
    }
  }
`;

const GET_TEACHERS = gql`
  query GetTeachers {
    getTeachers {
      id
      name
      email
      subject
      phone
    }
  }
`;

const ADD_TEACHER = gql`
  mutation AddTeacher(
    $name: String!
    $email: String!
    $subject: [String!]!
    $phone: String!
  ) {
    addTeacher(name: $name, email: $email, subject: $subject, phone: $phone) {
      id
      name
      subject
    }
  }
`;

const UPDATE_TEACHER = gql`
  mutation UpdateTeacher(
    $id: ID!
    $name: String
    $email: String
    $subject: [String!]
    $phone: String
  ) {
    updatedTeacher(
      id: $id
      name: $name
      email: $email
      subject: $subject
      phone: $phone
    ) {
      id
      name
      subject
    }
  }
`;

const TeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: [],
    phone: "",
  });

  const [subjectInput, setSubjectInput] = useState(""); 
  
  const { loading: queryLoading, data: queryData } = useQuery(GET_TEACHER, {
    variables: { id },
    skip: !isEditMode,
  });

  useEffect(() => {
    if (isEditMode && queryData?.getTeacher) {
      const teacher = queryData.getTeacher;
      setForm({
        name: teacher.name,
        email: teacher.email,
        subject: Array.isArray(teacher.subject)
          ? teacher.subject
          : [teacher.subject],
        phone: teacher.phone,
      });
    }
  }, [isEditMode, queryData]);

  // Mutations
  const [addTeacher, { loading: addLoading }] = useMutation(ADD_TEACHER, {
    refetchQueries: [{ query: GET_TEACHERS }],
  });

  const [updateTeacher, { loading: updateLoading }] = useMutation(
    UPDATE_TEACHER,
    {
      refetchQueries: [{ query: GET_TEACHERS }],
    }
  );

  const loading = queryLoading || addLoading || updateLoading;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add subject to the array
  const handleAddSubject = () => {
    if (subjectInput.trim() && !form.subject.includes(subjectInput.trim())) {
      setForm({ ...form, subject: [...form.subject, subjectInput.trim()] });
      setSubjectInput("");
    }
  };

  // Remove subject from array
  const handleRemoveSubject = (subjectToRemove) => {
    setForm({
      ...form,
      subject: form.subject.filter((s) => s !== subjectToRemove),
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (form.subject.length === 0) {
      return alert("Please add at least one subject.");
    }

    try {
      if (isEditMode) {
        await updateTeacher({ variables: { id, ...form } });
        alert("Teacher updated successfully!");
      } else {
        await addTeacher({ variables: form });
        alert("Teacher added successfully!");
      }
      navigate("/teachers");
    } catch (err) {
      console.error("Error:", err.message);
      alert(`Error: ${err.message}`);
    }
  };

  if (isEditMode && queryLoading) {
    return (
      <div className="text-center mt-10 text-lg">Loading Teacher Data...</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-2xl mt-10">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-4">
        {isEditMode ? "Edit Teacher" : "Add New Teacher"}
      </h1>

      <form onSubmit={submitHandler} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Teacher's Name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="teacher@example.com"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Subjects (Multiple) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subjects
          </label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddSubject())
              }
              placeholder="e.g., Mathematics"
              className="flex-1 border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSubject}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>

          {/* Display Added Subjects */}
          <div className="mt-3 flex flex-wrap gap-2">
            {form.subject.map((subject, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {subject}
                <button
                  type="button"
                  onClick={() => handleRemoveSubject(subject)}
                  className="ml-2 text-indigo-600 hover:text-indigo-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="e.g., 0300-1234567"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : isEditMode
            ? "Update Teacher"
            : "Add Teacher"}
        </button>
      </form>
    </div>
  );
};

export default TeacherForm;
