import React from "react";
import { Link } from "react-router-dom";

const StudentCard = ({ student, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800">{student.name}</h3>
      <p className="text-gray-600 text-sm">Age: {student.age}</p>
      <p className="text-gray-600 text-sm">
        Class: {student.class ? student.class.name : "N/A"}
      </p>
      <div className="mt-4 flex space-x-2">
        <Link
          to={`/student/${student.id}`}
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
        >
          View
        </Link>
        <button
          onClick={() => onDelete(student.id)}
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
