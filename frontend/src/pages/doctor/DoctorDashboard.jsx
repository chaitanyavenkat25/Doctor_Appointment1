import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FiUsers, FiCalendar, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/common/StatCard";
import Spinner from "../../components/common/Spinner";
import { formatDate, getStatusBadge } from "../../utils/helpers";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/doctors/dashboard/stats"),
      api.get("/doctors/appointments/my?status=pending"),
    ]).then(([s, a]) => {
      setStats(s.data.stats);
      setRecent(a.data.appointments.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const chartData = [
    { name: "Pending",   count: stats?.pending   || 0 },
    { name: "Approved",  count: stats?.approved  || 0 },
    { name: "Completed", count: stats?.completed || 0 },
    { name: "Cancelled", count: stats?.cancelled || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {user?.name} 👋</h1>
        {user?.isApproved === "pending" && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
            ⏳ Your account is pending admin approval. You can set up your profile in the meantime.
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Appointments" value={stats?.total || 0} icon={FiCalendar} color="blue" />
        <StatCard title="Pending" value={stats?.pending || 0} icon={FiClock} color="yellow" />
        <StatCard title="Completed" value={stats?.completed || 0} icon={FiCheckCircle} color="green" />
        <StatCard title="Cancelled" value={stats?.cancelled || 0} icon={FiXCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Appointment Overview</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pending appointments */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Pending Appointments</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No pending appointments</p>
          ) : (
            <div className="space-y-3">
              {recent.map((a) => (
                <div key={a._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.patient?.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(a.appointmentDate)} · {a.timeSlot}</p>
                  </div>
                  <span className={getStatusBadge(a.status)}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
