import { Link } from "react-router-dom";
import { FiStar, FiMapPin, FiBriefcase } from "react-icons/fi";
import { formatCurrency, imgUrl } from "../../utils/helpers";

export default function DoctorCard({ doctor }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <img
          src={doctor.photo ? imgUrl(doctor.photo) : `https://ui-avatars.com/api/?name=${doctor.name}&background=0ea5e9&color=fff`}
          alt={doctor.name}
          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">Dr. {doctor.name}</h3>
          <p className="text-primary text-sm font-medium">{doctor.specialization}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1"><FiBriefcase />{doctor.experience}y exp</span>
            {doctor.hospital && <span className="flex items-center gap-1 truncate"><FiMapPin />{doctor.hospital}</span>}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
              <span className="text-sm font-medium">{Number(doctor.rating || 0).toFixed(1)}</span>
              <span className="text-xs text-gray-400">({doctor.totalRatings || 0})</span>
            </div>
            <span className="text-primary font-semibold text-sm">{formatCurrency(doctor.consultationFee)}</span>
          </div>
        </div>
      </div>
      <Link to={`/doctors/${doctor._id}`} className="btn-primary block text-center mt-4 text-sm py-2">
        Book Appointment
      </Link>
    </div>
  );
}
