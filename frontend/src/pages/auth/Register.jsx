import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { SPECIALIZATIONS } from "../../utils/helpers";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", gender: "other",
    specialization: "", experience: "", consultationFee: "", hospital: "",
  });
  const [photo, setPhoto] = useState(null);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === "patient") {
        const { data } = await api.post("/auth/register/patient", form);
        // Auto-login
        await login({ email: form.email, password: form.password, role: "patient" });
        toast.success("Account created!");
        navigate("/doctors");
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (photo) fd.append("photo", photo);
        await api.post("/auth/register/doctor", fd);
        toast.success("Registration submitted! Awaiting admin approval.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="card shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Create Account</h1>
          <p className="text-center text-gray-500 text-sm mb-6">Join DocBook today</p>

          <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
            {["patient","doctor"].map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${type === t ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="name" value={form.name} onChange={set} required className="input-field" placeholder="John Doe" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={set} required className="input-field" placeholder="you@example.com" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" value={form.phone} onChange={set} className="input-field" placeholder="+1 234 567 8900" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input name="password" type="password" value={form.password} onChange={set} required minLength={6} className="input-field" placeholder="Min 6 characters" />
              </div>

              {type === "patient" ? (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select name="gender" value={form.gender} onChange={set} className="input-field">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              ) : (
                <>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <select name="specialization" value={form.specialization} onChange={set} required className="input-field">
                      <option value="">Select…</option>
                      {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                    <input name="experience" type="number" value={form.experience} onChange={set} required className="input-field" placeholder="5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee ($)</label>
                    <input name="consultationFee" type="number" value={form.consultationFee} onChange={set} required className="input-field" placeholder="100" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital/Clinic</label>
                    <input name="hospital" value={form.hospital} onChange={set} className="input-field" placeholder="City General Hospital" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="input-field file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-primary/10 file:text-primary" />
                  </div>
                </>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
