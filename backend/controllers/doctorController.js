const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const { sendAppointmentStatus } = require("../utils/email");
const User = require("../models/User");

exports.getAllDoctors = async (req, res) => {
  const { specialization, minExp, maxFee, search, page = 1, limit = 10 } = req.query;
  const query = { isApproved: "approved", isActive: true };

  if (specialization) query.specialization = specialization;
  if (minExp) query.experience = { $gte: Number(minExp) };
  if (maxFee) query.consultationFee = { ...query.consultationFee, $lte: Number(maxFee) };
  if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { specialization: { $regex: search, $options: "i" } }];

  const total = await Doctor.countDocuments(query);
  const doctors = await Doctor.find(query)
    .select("-password -availability")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort("-rating");

  res.json({ success: true, total, page: Number(page), doctors });
};

exports.getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).select("-password");
  if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
  res.json({ success: true, doctor });
};

exports.updateDoctorProfile = async (req, res) => {
  const updates = { ...req.body };
  delete updates.password;
  delete updates.isApproved;
  if (req.file) updates.photo = `/uploads/${req.file.filename}`;

  const doctor = await Doctor.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select("-password");
  res.json({ success: true, doctor });
};

exports.setAvailability = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.user._id,
    { availability: req.body.availability },
    { new: true }
  ).select("availability");
  res.json({ success: true, availability: doctor.availability });
};

exports.getDoctorAppointments = async (req, res) => {
  const { status } = req.query;
  const query = { doctor: req.user._id };
  if (status) query.status = status;

  const appointments = await Appointment.find(query)
    .populate("patient", "name email phone photo")
    .sort("-appointmentDate");
  res.json({ success: true, appointments });
};

exports.updateAppointmentStatus = async (req, res) => {
  const { status, notes } = req.body;
  const appointment = await Appointment.findOne({ _id: req.params.id, doctor: req.user._id }).populate("patient", "name email");
  if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

  appointment.status = status;
  if (notes) appointment.notes = notes;
  await appointment.save();

  try {
    await sendAppointmentStatus(appointment.patient.email, appointment.patient.name, status, req.user.name, appointment.appointmentDate.toDateString());
  } catch {}

  res.json({ success: true, appointment });
};

exports.getDoctorStats = async (req, res) => {
  const doctorId = req.user._id;
  const [total, pending, approved, completed, cancelled] = await Promise.all([
    Appointment.countDocuments({ doctor: doctorId }),
    Appointment.countDocuments({ doctor: doctorId, status: "pending" }),
    Appointment.countDocuments({ doctor: doctorId, status: "approved" }),
    Appointment.countDocuments({ doctor: doctorId, status: "completed" }),
    Appointment.countDocuments({ doctor: doctorId, status: "cancelled" }),
  ]);
  res.json({ success: true, stats: { total, pending, approved, completed, cancelled } });
};

exports.getSpecializations = async (req, res) => {
  const specs = await Doctor.distinct("specialization", { isApproved: "approved" });
  res.json({ success: true, specializations: specs });
};
