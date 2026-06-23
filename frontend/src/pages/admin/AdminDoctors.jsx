import { useState, useEffect } from "react";
import api from "../../utils/api";
import Spinner from "../../components/common/Spinner";
import { formatDate, getStatusBadge, imgUrl } from "../../utils/helpers";
import toast from "react-hot-toast";
import { FiCheck, FiX, FiTrash2, FiToggleLeft, FiToggleRight } from "react-icons/fi";

const FILTERS = ["all","pending","approved","rejected"];

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const { data } = await api.get("/admin/doctors", { params });
      setDoctors(data.doctors);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchDoctors(); }, [filter]);

  const approve = async (id, status) => {
    try {
      await api.put(`/admin/doctors/${id}/approval`, { status });
      toast.success(`Doctor ${status}`);
      fetchDoctors();
    } catch { toast.error("Action failed"); }
  };

  const toggle = async (id) => {
    try {
      const { data } = await api.put(`/admin/doctors/${id}/toggle`);
      toast.success(data.message);
      fetchDoctors();
    } catch { toast.error("Action failed"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await api.delete(`/admin/doctors/${id}`);
      toast.success("Doctor deleted");
      fetchDoctors();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Doctors</h1>

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter===f ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Doctor","Specialization","Experience","Fee","Status","Joined","Actions"].map(h=>(
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {doctors.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={d.photo ? imgUrl(d.photo) : `https://ui-avatars.com/api/?name=${d.name}&size=36&background=0ea5e9&color=fff`}
                          className="w-9 h-9 rounded-full object-cover" alt="" />
                        <div>
                          <p className="font-medium text-gray-900 whitespace-nowrap">Dr. {d.name}</p>
                          <p className="text-xs text-gray-400">{d.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{d.specialization}</td>
                    <td className="px-4 py-3 text-gray-600">{d.experience}y</td>
                    <td className="px-4 py-3 text-gray-600">${d.consultationFee}</td>
                    <td className="px-4 py-3">
                      <span className={getStatusBadge(d.isApproved)}>{d.isApproved}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(d.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {d.isApproved === "pending" && (
                          <>
                            <button onClick={() => approve(d._id,"approved")} title="Approve"
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <FiCheck size={16} />
                            </button>
                            <button onClick={() => approve(d._id,"rejected")} title="Reject"
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <FiX size={16} />
                            </button>
                          </>
                        )}
                        <button onClick={() => toggle(d._id)} title={d.isActive ? "Deactivate" : "Activate"}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                          {d.isActive ? <FiToggleRight size={16} className="text-green-500" /> : <FiToggleLeft size={16} />}
                        </button>
                        <button onClick={() => remove(d._id)} title="Delete"
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {doctors.length === 0 && <p className="text-center text-gray-400 py-10">No doctors found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
