import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ROLES = [
  { value: "patient", label: "Patient" },
  { value: "doctor",  label: "Doctor"  },
  { value: "admin",   label: "Admin"   },
];

const ROLE_REDIRECT = { patient: "/doctors", doctor: "/doctor/dashboard", admin: "/admin/dashboard" };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "patient" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(ROLE_REDIRECT[data.user.role] || "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your DocBook account</p>
          </div>

          {/* Role selector */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
            {ROLES.map((r) => (
              <button
                key={r.value}
                onClick={() => setForm({ ...form, role: r.value })}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${form.role === r.value ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password" required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            No account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
