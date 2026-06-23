const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.updateProfile = async (req, res) => {
  const updates = { ...req.body };
  delete updates.password;
  delete updates.role;
  if (req.file) updates.photo = `/uploads/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select("-password");
  res.json({ success: true, user });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword)))
    return res.status(400).json({ success: false, message: "Current password incorrect" });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated" });
};

exports.getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate("doctor", "name photo specialization consultationFee hospital")
    .sort("-createdAt");
  res.json({ success: true, appointments });
};
