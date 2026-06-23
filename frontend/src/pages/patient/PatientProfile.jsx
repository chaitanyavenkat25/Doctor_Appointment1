import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiUser, FiLock, FiCamera } from "react-icons/fi";
import { imgUrl } from "../../utils/helpers";

export default function PatientProfile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({ name: user?.name||"", phone: user?.phone||"", gender: user?.gender||"other", address: user?.address||"", bloodType: user?.bloodType||"" });
  const [photo, setPhoto] = useState(null);
  const [pwForm, setPwForm] = useState({ currentPassword:"", newPassword:"", confirm:"" });
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      if (photo) fd.append("photo", photo);
      const { data } = await api.put("/users/profile", fd);
      updateUser(data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error("Passwords don't match"); return; }
    setLoading(true);
    try {
      await api.put("/users/change-password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success("Password changed!");
      setPwForm({ currentPassword:"", newPassword:"", confirm:"" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Avatar */}
      <div className="card mb-6 flex items-center gap-5">
        <div className="relative">
          <img
            src={photo ? URL.createObjectURL(photo) : (user?.photo ? imgUrl(user.photo) : `https://ui-avatars.com/api/?name=${user?.name}&background=0ea5e9&color=fff&size=80`)}
            className="w-20 h-20 rounded-full object-cover"
            alt=""
          />
          <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer">
            <FiCamera size={12} className="text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files[0])} />
          </label>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {[["profile","Profile"],["password","Password"]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab===t ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "profile" ? (
        <form onSubmit={handleProfile} className="card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input name="name" value={form.name} onChange={set} className="input-field" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={set} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={set} className="input-field">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
              <select name="bloodType" value={form.bloodType} onChange={set} className="input-field">
                <option value="">Select…</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input name="address" value={form.address} onChange={set} className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? "Saving…" : "Save Changes"}</button>
        </form>
      ) : (
        <form onSubmit={handlePassword} className="card space-y-4">
          {[["currentPassword","Current Password"],["newPassword","New Password"],["confirm","Confirm New Password"]].map(([n,l])=>(
            <div key={n}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
              <input type="password" value={pwForm[n]} onChange={(e) => setPwForm({...pwForm,[n]:e.target.value})} className="input-field" required minLength={6} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary">{loading ? "Updating…" : "Update Password"}</button>
        </form>
      )}
    </div>
  );
}
