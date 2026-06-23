import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Patient pages
import DoctorList from "./pages/patient/DoctorList";
import DoctorDetail from "./pages/patient/DoctorDetail";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientProfile from "./pages/patient/PatientProfile";

// Doctor pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorAvailability from "./pages/doctor/DoctorAvailability";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminAppointments from "./pages/admin/AdminAppointments";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doctors" element={<DoctorList />} />
              <Route path="/doctors/:id" element={<DoctorDetail />} />

              {/* Patient */}
              <Route path="/patient/appointments" element={
                <ProtectedRoute roles={["patient"]}><PatientAppointments /></ProtectedRoute>
              } />
              <Route path="/patient/profile" element={
                <ProtectedRoute roles={["patient"]}><PatientProfile /></ProtectedRoute>
              } />

              {/* Doctor */}
              <Route path="/doctor/dashboard" element={
                <ProtectedRoute roles={["doctor"]}><DoctorDashboard /></ProtectedRoute>
              } />
              <Route path="/doctor/appointments" element={
                <ProtectedRoute roles={["doctor"]}><DoctorAppointments /></ProtectedRoute>
              } />
              <Route path="/doctor/availability" element={
                <ProtectedRoute roles={["doctor"]}><DoctorAvailability /></ProtectedRoute>
              } />
              <Route path="/doctor/profile" element={
                <ProtectedRoute roles={["doctor"]}><DoctorProfile /></ProtectedRoute>
              } />

              {/* Admin */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/doctors" element={
                <ProtectedRoute roles={["admin"]}><AdminDoctors /></ProtectedRoute>
              } />
              <Route path="/admin/patients" element={
                <ProtectedRoute roles={["admin"]}><AdminPatients /></ProtectedRoute>
              } />
              <Route path="/admin/appointments" element={
                <ProtectedRoute roles={["admin"]}><AdminAppointments /></ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
