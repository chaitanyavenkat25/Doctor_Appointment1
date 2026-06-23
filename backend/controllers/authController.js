const User = require("../models/User");
const Doctor = require("../models/Doctor");
const generateToken = require("../utils/generateToken");

// @desc  Register patient
exports.registerPatient = async (req, res) => {
  const { name, email, password, phone, gender } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ success: false, message: "Email already exists" });

  const user = await User.create({ name, email, password, phone, gender });
  res.status(201).json({
    success: true,
    token: generateToken(user._id, "patient"),
    user: { _id: user._id, name: user.name, email: user.email, role: "patient", photo: user.photo },
  });
};

// @desc  Register doctor
exports.registerDoctor = async (req, res) => {
  const { name, email, password, phone, specialization, experience, consultationFee, hospital } = req.body;
  const exists = await Doctor.findOne({ email });
  if (exists) return res.status(400).json({ success: false, message: "Email already exists" });

  const photo = req.file ? `/uploads/${req.file.filename}` : "";
  const doctor = await Doctor.create({ name, email, password, phone, specialization, experience, consultationFee, hospital, photo });
  res.status(201).json({
    success: true,
    message: "Registration submitted. Awaiting admin approval.",
    token: generateToken(doctor._id, "doctor"),
    user: { _id: doctor._id, name: doctor.name, email: doctor.email, role: "doctor", photo: doctor.photo, isApproved: doctor.isApproved },
  });
};

// @desc  Login (patient / admin / doctor)
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  let account;
  let userRole = role;

  if (role === "doctor") {
    account = await Doctor.findOne({ email });
  } else {
    account = await User.findOne({ email });
    if (account) userRole = account.role; // preserve admin role
  }

  if (!account || !(await account.matchPassword(password)))
    return res.status(401).json({ success: false, message: "Invalid credentials" });

  if (!account.isActive)
    return res.status(403).json({ success: false, message: "Account deactivated" });

  res.json({
    success: true,
    token: generateToken(account._id, userRole),
    user: {
      _id: account._id,
      name: account.name,
      email: account.email,
      role: userRole,
      photo: account.photo || "",
      ...(userRole === "doctor" && { isApproved: account.isApproved }),
    },
  });
};

// @desc  Get current user profile
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
