import { Link } from "react-router-dom";
import { FiSearch, FiCalendar, FiShield, FiStar } from "react-icons/fi";

const FEATURES = [
  { icon: FiSearch, title: "Find Specialists", desc: "Search doctors by specialization, experience, and location." },
  { icon: FiCalendar, title: "Easy Booking", desc: "Book appointments in minutes with real-time availability." },
  { icon: FiShield, title: "Verified Doctors", desc: "All doctors are verified and approved by our admin team." },
  { icon: FiStar, title: "Patient Reviews", desc: "Read genuine reviews to choose the best doctor for you." },
];

const SPECS = ["Cardiology","Neurology","Orthopedics","Pediatrics","Dermatology","Gynecology","Psychiatry","General Medicine"];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-light via-white to-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Book Your Doctor <span className="text-primary">Appointment</span> Online
          </h1>
          <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
            Connect with top-rated specialists, manage your health records, and never miss an appointment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/doctors" className="btn-primary text-base px-8 py-3">Find a Doctor</Link>
            <Link to="/register" className="btn-outline text-base px-8 py-3">Get Started Free</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Why Choose DocBook?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-primary" size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Browse by Specialization</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SPECS.map((s) => (
              <Link key={s} to={`/doctors?specialization=${s}`}
                className="bg-white border border-gray-100 rounded-xl py-4 text-center text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors shadow-sm">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Are You a Doctor?</h2>
        <p className="text-primary-light mb-6 max-w-md mx-auto">
          Join DocBook to reach thousands of patients and manage your appointments efficiently.
        </p>
        <Link to="/register" className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
          Register as Doctor
        </Link>
      </section>
    </div>
  );
}
