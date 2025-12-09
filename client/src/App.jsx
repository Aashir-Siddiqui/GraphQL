import { Routes, Route } from "react-router-dom";
import Students from "./pages/Students.jsx";
import Teachers from "./pages/Teachers.jsx";
import Classes from "./pages/Classes.jsx";
import Attendance from "./pages/Attendance.jsx";
import Navbar from "./components/Navbar.jsx";
import StudentForm from "./components/StudentForm.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Students />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/add-student" element={<StudentForm />} />
          {/* Add more specific routes like /edit-student/:id if needed */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
