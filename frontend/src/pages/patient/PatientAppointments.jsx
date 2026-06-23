import { useState, useEffect } from "react";
import api from "../../utils/api";
import AppointmentCard from "../../components/patient/AppointmentCard";
import Spinner from "../../components/common/Spinner";
import { FiCalendar } from "react-icons/fi";

const STATUSES = ["all","pending","approved","completed","cancelled","rejected"];

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users/appointments");
      setAppointments(data.appointments);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchAppointments(); }, []);

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <FiCalendar className="text-primary text-2xl" />
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No appointments found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => <AppointmentCard key={a._id} appointment={a} onUpdate={fetchAppointments} />)}
        </div>
      )}
    </div>
  );
}
