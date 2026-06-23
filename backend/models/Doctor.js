const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const timeSlotSchema = new mongoose.Schema({
  day: { type: String, enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
  slots: [{ time: String, isBooked: { type: Boolean, default: false } }],
});

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, default: "" },
    photo: { type: String, default: "" },
    specialization: { type: String, required: true },
    qualifications: [String],
    experience: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    hospital: { type: String, default: "" },
    address: { type: String, default: "" },
    consultationFee: { type: Number, default: 0 },
    availability: [timeSlotSchema],
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    isApproved: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

doctorSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("Doctor", doctorSchema);
