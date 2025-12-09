import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 p-8">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Welcome to <span className="text-indigo-700">Student Hub</span>
        </h1>
        <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Your comprehensive solution for managing student data, classes, and
          attendance with ease. A powerful platform built with React, GraphQL,
          and MongoDB.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link
            to="/students"
            className="bg-indigo-600 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            View Students
          </Link>
          <Link
            to="/add-student"
            className="bg-white text-indigo-700 text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-indigo-50 border-2 border-indigo-600 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Add New Student
          </Link>
        </div>
      </div>
      <div className="mt-20">
        {/* Placeholder for an image or illustration */}
        <p className="text-gray-500 text-sm"></p>
      </div>
    </div>
  );
};

export default HomePage;
