import { useState, useEffect } from "react";
import api from "../../utils/api";
import Spinner from "../../components/common/Spinner";
import { formatDate, getStatusBadge } from "../../utils/helpers";

const STATUSES = ["all","pending","approved","completed","cancelled","rejected"];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, ...(status !== "all" && { status }) };
      const { data } = await api.get("/admin/appointments", { params });
      setAppointments(data.appointments);
      setTotal(data.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAppointments(); }, [status, page]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Appointments</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${status===s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {s}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-3">{total} appointment{total !== 1 ? "s" : ""}</p>

      {loading ? <Spinner /> : (
        <>
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {["Patient","Doctor","Date","Time","Status","Booked On"].map(h=>(
                      <th key={h} className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 whitespace-nowrap">{a.patient?.name}</p>
                        <p className="text-xs text-gray-400">{a.patient?.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900 whitespace-nowrap">Dr. {a.doctor?.name}</p>
                        <p className="text-xs text-primary">{a.doctor?.specialization}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(a.appointmentDate)}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.timeSlot}</td>
                      <td className="px-4 py-3">
                        <span className={getStatusBadge(a.status)}>{a.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(a.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && <p className="text-center text-gray-400 py-10">No appointments found.</p>}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i+1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page===p ? "bg-primary text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}>
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
