import { useState, useEffect } from "react";
import api from "../../utils/api";
import { DAYS, TIME_SLOTS } from "../../utils/helpers";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";
import { FiPlus, FiX, FiSave } from "react-icons/fi";

export default function DoctorAvailability() {
  const [availability, setAvailability] = useState(DAYS.map((day) => ({ day, slots: [] })));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/auth/me").then(({ data }) => {
      if (data.user.availability?.length > 0) {
        const merged = DAYS.map((day) => {
          const existing = data.user.availability.find((a) => a.day === day);
          return existing || { day, slots: [] };
        });
        setAvailability(merged);
      }
    }).finally(() => setLoading(false));
  }, []);

  const addSlot = (dayIdx, time) => {
    const updated = [...availability];
    const day = updated[dayIdx];
    if (!day.slots.find((s) => s.time === time)) {
      day.slots = [...day.slots, { time, isBooked: false }];
    }
    setAvailability(updated);
  };

  const removeSlot = (dayIdx, time) => {
    const updated = [...availability];
    updated[dayIdx].slots = updated[dayIdx].slots.filter((s) => s.time !== time);
    setAvailability(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/doctors/availability", { availability });
      toast.success("Availability saved!");
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Set Availability</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <FiSave /> {saving ? "Saving…" : "Save Schedule"}
        </button>
      </div>

      <div className="space-y-4">
        {availability.map((dayData, dayIdx) => (
          <div key={dayData.day} className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 w-28">{dayData.day}</h3>
              <div className="flex-1 flex flex-wrap gap-2">
                {dayData.slots.map((s) => (
                  <span key={s.time} className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full">
                    {s.time}
                    <button onClick={() => removeSlot(dayIdx, s.time)} className="text-primary/60 hover:text-red-500">
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t pt-3">
              <p className="text-xs text-gray-400 mb-2">Add time slots:</p>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.filter((t) => !dayData.slots.find((s) => s.time === t)).map((t) => (
                  <button key={t} onClick={() => addSlot(dayIdx, t)}
                    className="text-xs border border-gray-200 px-3 py-1.5 rounded-full text-gray-600 hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
                    <FiPlus size={11} /> {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
