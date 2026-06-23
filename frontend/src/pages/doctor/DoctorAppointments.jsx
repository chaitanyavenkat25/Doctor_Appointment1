import { useState, useEffect } from "react";
import api from "../../utils/api";
import { formatDate, getStatusBadge, imgUrl } from "../../utils/helpers";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { FiCheck, FiX, FiUser } from "react-icons/fi";

const STATUSES = ["all","pending","approved","completed","cancelled","rejected"];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [notes, setNotes] = useState({});
  const [updating, setUpdating] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const { data } = await api.get("/doctors/appointments/my", { params });
      setAppointments(data.appointments);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAppointments(); }, [filter]);

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await api.put(`/doctors/appointments/${id}/status`, { status, notes: notes[id] || "" });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Appointments</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter===s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : appointments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No appointments found.</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div key={a._id} className="card">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {a.patient?.photo ? (
                      <img src={imgUrl(a.patient.photo)} className="w-11 h-11 rounded-full object-cover" alt="" />
                    ) : <FiUser className="text-primary" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{a.patient?.name}</p>
                    <p className="text-xs text-gray-500">{a.patient?.email} · {a.patient?.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(a.appointmentDate)} at {a.timeSlot}</p>
                    {a.symptoms && <p className="text-xs text-gray-400 mt-0.5">Symptoms: {a.symptoms}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <span className={getStatusBadge(a.status)}>{a.status}</span>
                  {a.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(a._id, "approved")}
                        disabled={!!updating}
                        className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors">
                        <FiCheck /> Approve
                      </button>
                      <button onClick={() => updateStatus(a._id, "rejected")}
                        disabled={!!updating}
                        className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors">
                        <FiX /> Reject
                      </button>
                    </div>
                  )}
                  {a.status === "approved" && (
                    <button onClick={() => updateStatus(a._id, "completed")}
                      disabled={!!updating}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors">
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>

              {a.status === "pending" && (
                <div className="mt-3 pt-3 border-t">
                  <input
                    value={notes[a._id] || ""}
                    onChange={(e) => setNotes({ ...notes, [a._id]: e.target.value })}
                    className="input-field text-sm py-2"
                    placeholder="Add a note (optional)…"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
