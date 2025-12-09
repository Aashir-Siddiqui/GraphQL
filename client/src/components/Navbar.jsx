import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navLinks = [
    { to: "/students", name: "Students" },
    { to: "/teachers", name: "Teachers" },
    { to: "/classes", name: "Classes" },
    { to: "/attendance", name: "Attendance" },
  ];

  return (
    <nav className="bg-indigo-700 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-white text-2xl font-bold tracking-wide">
          Student <span className="text-indigo-200">SMS</span>
        </NavLink>
        <div className="flex space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-indigo-200 border-b-2 border-indigo-200"
                    : "text-white hover:text-indigo-100"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
