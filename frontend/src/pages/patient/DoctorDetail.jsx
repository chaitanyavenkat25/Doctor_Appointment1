import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiStar, FiBriefcase, FiMapPin, FiDollarSign, FiCalendar } from "react-icons/fi";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { formatDate, formatCurrency, TIME_SLOTS, imgUrl } from "../../utils/helpers";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";

export default function DoctorDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [form, setForm] = useState({ appointmentDate: "", timeSlot: "", symptoms: "" });
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get(`/doctors/${id}`), api.get(`/reviews/doctor/${id}`)])
      .then(([d, r]) => { setDoctor(d.data.doctor); setReviews(r.data.reviews); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    setBooking(true);
    try {
      await api.post("/appointments/book", { doctorId: id, ...form });
      toast.success("Appointment booked successfully!");
      navigate("/patient/appointments");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      const { data } = await api.post("/reviews", { doctorId: id, ...newReview });
      setReviews([data.review, ...reviews]);
      toast.success("Review submitted!");
      setNewReview({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!doctor) return <div className="text-center py-16 text-gray-400">Doctor not found</div>;

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={doctor.photo ? imgUrl(doctor.photo) : `https://ui-avatars.com/api/?name=${doctor.name}&background=0ea5e9&color=fff&size=200`}
                alt={doctor.name}
                className="w-32 h-32 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">Dr. {doctor.name}</h1>
                <p className="text-primary font-semibold">{doctor.specialization}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><FiBriefcase className="text-primary" />{doctor.experience} years experience</span>
                  <span className="flex items-center gap-1"><FiMapPin className="text-primary" />{doctor.hospital || "N/A"}</span>
                  <span className="flex items-center gap-1"><FiDollarSign className="text-primary" />{formatCurrency(doctor.consultationFee)} per visit</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {[1,2,3,4,5].map((s) => (
                    <FiStar key={s} size={16}
                      className={s <= Math.round(doctor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                  ))}
                  <span className="text-sm text-gray-500">({doctor.totalRatings} reviews)</span>
                </div>
                {doctor.bio && <p className="text-gray-600 text-sm mt-3">{doctor.bio}</p>}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Reviews</h2>
            {user?.role === "patient" && (
              <form onSubmit={handleReview} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} type="button" onClick={() => setNewReview({ ...newReview, rating: s })}>
                      <FiStar size={20} className={s <= newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="input-field"
                  rows={2}
                  placeholder="Share your experience…"
                />
                <button type="submit" disabled={reviewLoading} className="btn-primary text-sm py-2">
                  {reviewLoading ? "Submitting…" : "Submit Review"}
                </button>
              </form>
            )}
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="flex gap-3 pb-4 border-b last:border-0">
                    <img
                      src={r.patient?.photo ? imgUrl(r.patient.photo) : `https://ui-avatars.com/api/?name=${r.patient?.name}&size=40`}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      alt=""
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-900">{r.patient?.name}</span>
                        <div className="flex">
                          {[1,2,3,4,5].map((s) => (
                            <FiStar key={s} size={12} className={s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                          ))}
                        </div>
                      </div>
                      {r.comment && <p className="text-sm text-gray-600 mt-0.5">{r.comment}</p>}
                      <p className="text-xs text-gray-400 mt-1">{formatDate(r.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiCalendar className="text-primary" /> Book Appointment
            </h2>
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date" required
                  min={minDate}
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                <select
                  required
                  value={form.timeSlot}
                  onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select time…</option>
                  {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (optional)</label>
                <textarea
                  rows={3}
                  value={form.symptoms}
                  onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                  className="input-field"
                  placeholder="Describe your symptoms…"
                />
              </div>
              <div className="bg-primary-light rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-bold text-primary">{formatCurrency(doctor.consultationFee)}</span>
                </div>
              </div>
              <button type="submit" disabled={booking} className="btn-primary w-full">
                {booking ? "Booking…" : "Confirm Booking"}
              </button>
              {!user && <p className="text-xs text-center text-gray-400">You'll be redirected to login</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
