import { Routes, Route } from "react-router-dom";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import StudentForm from "./components/StudentForm";
import TeacherForm from "./components/TeacherForm";
import AttendanceForm from "./components/AttendanceForm";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import StudentDetails from "./pages/StudentDetails";
import TeacherDetails from "./pages/TeacherDetails";
import ClassForm from "./components/ClassForm";
import ClassDetail from "./pages/ClassDetail";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/students" element={<Students />} />
          <Route path="/student/:id" element={<StudentDetails />} />
          <Route path="/add-student" element={<StudentForm />} />
          <Route path="/edit-student/:id" element={<StudentForm />} />

          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teacher/:id" element={<TeacherDetails />} />
          <Route path="/add-teacher" element={<TeacherForm />} />
          <Route path="/edit-teacher/:id" element={<TeacherForm />} />

          <Route path="/classes" element={<Classes />} />
          <Route path="/add-class" element={<ClassForm />} />
          <Route path="/edit-class/:id" element={<ClassForm />} />
          <Route path="/class/:id" element={<ClassDetail />} />

          <Route path="/attendance" element={<Attendance />} />
          <Route path="/mark-attendance" element={<AttendanceForm />} />

          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center">
                  <h1 className="text-9xl font-bold text-gray-800">404</h1>
                  <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
                  <a
                    href="/"
                    className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
