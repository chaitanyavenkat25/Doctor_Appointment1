import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { SPECIALIZATIONS, imgUrl } from "../../utils/helpers";
import { FiCamera } from "react-icons/fi";

export default function DoctorProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name||"", phone: user?.phone||"", specialization: user?.specialization||"",
    experience: user?.experience||"", consultationFee: user?.consultationFee||"",
    hospital: user?.hospital||"", bio: user?.bio||"", address: user?.address||"",
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      if (photo) fd.append("photo", photo);
      const { data } = await api.put("/doctors/profile/update", fd);
      updateUser(data.doctor);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Doctor Profile</h1>

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
          <p className="font-semibold text-gray-900">Dr. {user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${{pending:"bg-yellow-100 text-yellow-700",approved:"bg-green-100 text-green-700",rejected:"bg-red-100 text-red-700"}[user?.isApproved]}`}>
            {user?.isApproved}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[["name","Full Name","text"],["phone","Phone","text"],["experience","Experience (years)","number"],["consultationFee","Consultation Fee ($)","number"],["hospital","Hospital/Clinic","text"]].map(([n,l,t])=>(
            <div key={n} className={n==="name"||n==="hospital" ? "col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
              <input name={n} type={t} value={form[n]} onChange={set} className="input-field" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <select name="specialization" value={form.specialization} onChange={set} className="input-field">
              {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea name="bio" value={form.bio} onChange={set} rows={3} className="input-field" placeholder="Tell patients about yourself…" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input name="address" value={form.address} onChange={set} className="input-field" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Saving…" : "Save Profile"}</button>
      </form>
    </div>
  );
}
