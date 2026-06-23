const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Review = require("../models/Review");
const { sendDoctorApproval } = require("../utils/email");

exports.getDashboardStats = async (req, res) => {
  const [totalPatients, totalDoctors, totalAppointments, pendingDoctors, revenue] = await Promise.all([
    User.countDocuments({ role: "patient" }),
    Doctor.countDocuments({ isApproved: "approved" }),
    Appointment.countDocuments(),
    Doctor.countDocuments({ isApproved: "pending" }),
    Appointment.aggregate([
      { $match: { status: "completed" } },
      { $lookup: { from: "doctors", localField: "doctor", foreignField: "_id", as: "doc" } },
      { $unwind: "$doc" },
      { $group: { _id: null, total: { $sum: "$doc.consultationFee" } } },
    ]),
  ]);

  const monthlyAppointments = await Appointment.aggregate([
    { $group: { _id: { $month: "$appointmentDate" }, count: { $sum: 1 } } },
    { $sort: { "_id": 1 } },
  ]);

  res.json({
    success: true,
    stats: {
      totalPatients,
      totalDoctors,
      totalAppointments,
      pendingDoctors,
      revenue: revenue[0]?.total || 0,
      monthlyAppointments,
    },
  });
};

exports.getAllDoctors = async (req, res) => {
  const { status } = req.query;
  const query = status ? { isApproved: status } : {};
  const doctors = await Doctor.find(query).select("-password").sort("-createdAt");
  res.json({ success: true, doctors });
};

exports.approveDoctorStatus = async (req, res) => {
  const { status } = req.body;
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved: status }, { new: true }).select("-password");
  if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
  try { await sendDoctorApproval(doctor.email, doctor.name, status); } catch {}
  res.json({ success: true, doctor });
};

exports.toggleDoctorActive = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
  doctor.isActive = !doctor.isActive;
  await doctor.save();
  res.json({ success: true, message: `Doctor ${doctor.isActive ? "activated" : "deactivated"}` });
};

exports.getAllPatients = async (req, res) => {
  const patients = await User.find({ role: "patient" }).select("-password").sort("-createdAt");
  res.json({ success: true, patients });
};

exports.togglePatientActive = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, message: `Patient ${user.isActive ? "activated" : "deactivated"}` });
};

exports.getAllAppointments = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const total = await Appointment.countDocuments(query);
  const appointments = await Appointment.find(query)
    .populate("patient", "name email phone")
    .populate("doctor", "name specialization")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ success: true, total, appointments });
};

exports.deleteDoctor = async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Doctor deleted" });
};
