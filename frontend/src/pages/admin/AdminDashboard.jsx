import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { FiUsers, FiUserCheck, FiCalendar, FiDollarSign, FiClock } from "react-icons/fi";
import api from "../../utils/api";
import StatCard from "../../components/common/StatCard";
import Spinner from "../../components/common/Spinner";
import { formatCurrency } from "../../utils/helpers";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard").then(({ data }) => setStats(data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const chartData = (stats?.monthlyAppointments || []).map((m) => ({
    month: MONTH_NAMES[m._id - 1],
    appointments: m.count,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Patients" value={stats?.totalPatients || 0} icon={FiUsers} color="blue" />
        <StatCard title="Approved Doctors" value={stats?.totalDoctors || 0} icon={FiUserCheck} color="green" />
        <StatCard title="Total Appointments" value={stats?.totalAppointments || 0} icon={FiCalendar} color="purple" />
        <StatCard title="Pending Approvals" value={stats?.pendingDoctors || 0} icon={FiClock} color="yellow" />
        <StatCard title="Revenue" value={formatCurrency(stats?.revenue || 0)} icon={FiDollarSign} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Monthly Appointments</h2>
          {chartData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="appointments" fill="#0ea5e9" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            {[
              { label: "Patients registered", value: stats?.totalPatients || 0, color: "text-blue-600" },
              { label: "Active doctors", value: stats?.totalDoctors || 0, color: "text-green-600" },
              { label: "Awaiting approval", value: stats?.pendingDoctors || 0, color: "text-yellow-600" },
              { label: "Total bookings", value: stats?.totalAppointments || 0, color: "text-purple-600" },
              { label: "Total revenue", value: formatCurrency(stats?.revenue || 0), color: "text-emerald-600" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className={`font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
