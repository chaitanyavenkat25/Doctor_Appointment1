const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { sendAppointmentConfirmation } = require("../utils/email");

exports.bookAppointment = async (req, res) => {
  const { doctorId, appointmentDate, timeSlot, symptoms } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor || doctor.isApproved !== "approved")
    return res.status(400).json({ success: false, message: "Doctor not available" });

  const conflict = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate),
    timeSlot,
    status: { $in: ["pending", "approved"] },
  });
  if (conflict) return res.status(400).json({ success: false, message: "Time slot already booked" });

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate),
    timeSlot,
    symptoms,
  });

  try {
    await sendAppointmentConfirmation(req.user.email, req.user.name, doctor.name, new Date(appointmentDate).toDateString(), timeSlot);
  } catch {}

  res.status(201).json({ success: true, appointment });
};

exports.cancelAppointment = async (req, res) => {
  const appointment = await Appointment.findOne({ _id: req.params.id, patient: req.user._id });
  if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });
  if (["completed", "cancelled"].includes(appointment.status))
    return res.status(400).json({ success: false, message: "Cannot cancel this appointment" });

  appointment.status = "cancelled";
  appointment.cancelReason = req.body.reason || "";
  await appointment.save();
  res.json({ success: true, message: "Appointment cancelled" });
};

exports.rescheduleAppointment = async (req, res) => {
  const { appointmentDate, timeSlot } = req.body;
  const appointment = await Appointment.findOne({ _id: req.params.id, patient: req.user._id });
  if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });
  if (appointment.status === "completed" || appointment.status === "cancelled")
    return res.status(400).json({ success: false, message: "Cannot reschedule" });

  const conflict = await Appointment.findOne({
    _id: { $ne: req.params.id },
    doctor: appointment.doctor,
    appointmentDate: new Date(appointmentDate),
    timeSlot,
    status: { $in: ["pending", "approved"] },
  });
  if (conflict) return res.status(400).json({ success: false, message: "Time slot not available" });

  appointment.appointmentDate = new Date(appointmentDate);
  appointment.timeSlot = timeSlot;
  appointment.status = "pending";
  await appointment.save();
  res.json({ success: true, appointment });
};
