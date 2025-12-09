import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      {" "}
      {/* Adjust height as needed */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="ml-4 text-xl text-gray-700">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
