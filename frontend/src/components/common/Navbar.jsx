import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { imgUrl } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = {
  patient: [
    { to: "/doctors", label: "Find Doctors" },
    { to: "/patient/appointments", label: "My Appointments" },
    { to: "/patient/profile", label: "Profile" },
  ],
  doctor: [
    { to: "/doctor/dashboard", label: "Dashboard" },
    { to: "/doctor/appointments", label: "Appointments" },
    { to: "/doctor/availability", label: "Availability" },
    { to: "/doctor/profile", label: "Profile" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/doctors", label: "Doctors" },
    { to: "/admin/patients", label: "Patients" },
    { to: "/admin/appointments", label: "Appointments" },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = user ? NAV_LINKS[user.role] || [] : [];

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="bg-primary text-white rounded-lg px-2 py-0.5">Doc</span>Book
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-gray-600 hover:text-primary text-sm font-medium transition-colors">
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.photo ? (
                  <img src={imgUrl(user.photo)} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <FiUser className="text-primary text-sm" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="btn-outline text-sm py-2">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-gray-600 hover:text-primary text-sm font-medium">
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="text-left text-sm text-red-500">Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-primary">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="text-sm font-medium text-primary">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
