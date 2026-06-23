import { useState, useEffect } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import api from "../../utils/api";
import DoctorCard from "../../components/doctor/DoctorCard";
import Spinner from "../../components/common/Spinner";
import { SPECIALIZATIONS } from "../../utils/helpers";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", specialization: "", minExp: "", maxFee: "" });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, ...filters };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await api.get("/doctors", { params });
      setDoctors(data.doctors);
      setTotal(data.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchDoctors(); }, [page, filters]);

  const set = (e) => { setFilters({ ...filters, [e.target.name]: e.target.value }); setPage(1); };
  const totalPages = Math.ceil(total / 9);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find a Doctor</h1>
        <p className="text-gray-500 mt-1">Book appointments with top-rated specialists</p>
      </div>

      {/* Filters */}
      <div className="card mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-48 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input name="search" value={filters.search} onChange={set} className="input-field pl-10" placeholder="Search doctors…" />
        </div>
        <select name="specialization" value={filters.specialization} onChange={set} className="input-field w-auto min-w-44">
          <option value="">All Specializations</option>
          {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input name="minExp" type="number" value={filters.minExp} onChange={set} className="input-field w-32" placeholder="Min Exp (yrs)" />
        <input name="maxFee" type="number" value={filters.maxFee} onChange={set} className="input-field w-32" placeholder="Max Fee ($)" />
        <button onClick={() => { setFilters({ search:"",specialization:"",minExp:"",maxFee:"" }); setPage(1); }} className="btn-outline text-sm py-2">
          Clear
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">{total} doctor{total !== 1 ? "s" : ""} found</p>

      {loading ? <Spinner /> : (
        <>
          {doctors.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No doctors found matching your criteria.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((d) => <DoctorCard key={d._id} doctor={d} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p ? "bg-primary text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
