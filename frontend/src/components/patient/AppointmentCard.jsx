import { useState } from "react";
import { FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { formatDate, getStatusBadge, imgUrl } from "../../utils/helpers";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function AppointmentCard({ appointment, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this appointment?")) return;
    setLoading(true);
    try {
      await api.put(`/appointments/${appointment._id}/cancel`);
      toast.success("Appointment cancelled");
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error cancelling");
    } finally {
      setLoading(false);
    }
  };

  const d = appointment.doctor;
  return (
    <div className="card flex flex-col sm:flex-row gap-4">
      <img
        src={d?.photo ? imgUrl(d.photo) : `https://ui-avatars.com/api/?name=${d?.name}&background=0ea5e9&color=fff`}
        alt={d?.name}
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-semibold text-gray-900">Dr. {d?.name}</h3>
            <p className="text-sm text-primary">{d?.specialization}</p>
          </div>
          <span className={getStatusBadge(appointment.status)}>{appointment.status}</span>
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1"><FiCalendar size={13} />{formatDate(appointment.appointmentDate)}</span>
          <span className="flex items-center gap-1"><FiClock size={13} />{appointment.timeSlot}</span>
        </div>
        {appointment.symptoms && <p className="text-xs text-gray-400 mt-1">Symptoms: {appointment.symptoms}</p>}
        {appointment.notes && <p className="text-xs text-gray-500 mt-1 italic">Doctor note: {appointment.notes}</p>}
      </div>
      {["pending", "approved"].includes(appointment.status) && (
        <button onClick={handleCancel} disabled={loading} className="self-start text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
          Cancel
        </button>
      )}
    </div>
  );
}
