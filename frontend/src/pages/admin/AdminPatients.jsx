import { useState, useEffect } from "react";
import api from "../../utils/api";
import Spinner from "../../components/common/Spinner";
import { formatDate, imgUrl } from "../../utils/helpers";
import toast from "react-hot-toast";
import { FiToggleLeft, FiToggleRight, FiSearch } from "react-icons/fi";

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/patients");
      setPatients(data.patients);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  const toggle = async (id) => {
    try {
      const { data } = await api.put(`/admin/patients/${id}/toggle`);
      toast.success(data.message);
      fetchPatients();
    } catch { toast.error("Action failed"); }
  };

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Patients</h1>
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 py-2 text-sm" placeholder="Search patients…" />
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Patient","Phone","Gender","Blood","Status","Joined","Action"].map(h=>(
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.photo ? imgUrl(p.photo) : `https://ui-avatars.com/api/?name=${p.name}&size=36`}
                          className="w-9 h-9 rounded-full object-cover" alt="" />
                        <div>
                          <p className="font-medium text-gray-900 whitespace-nowrap">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.phone || "—"}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">{p.gender}</td>
                    <td className="px-4 py-3 text-gray-600">{p.bloodType || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle(p._id)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        {p.isActive ? <FiToggleRight size={16} className="text-green-500" /> : <FiToggleLeft size={16} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-gray-400 py-10">No patients found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
