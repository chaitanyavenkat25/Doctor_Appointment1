const Review = require("../models/Review");
const Appointment = require("../models/Appointment");

exports.addReview = async (req, res) => {
  const { doctorId, rating, comment, appointmentId } = req.body;

  const existing = await Review.findOne({ doctor: doctorId, patient: req.user._id });
  if (existing) return res.status(400).json({ success: false, message: "Already reviewed this doctor" });

  const review = await Review.create({
    doctor: doctorId,
    patient: req.user._id,
    appointment: appointmentId,
    rating,
    comment,
  });
  await review.populate("patient", "name photo");
  res.status(201).json({ success: true, review });
};

exports.getDoctorReviews = async (req, res) => {
  const reviews = await Review.find({ doctor: req.params.doctorId })
    .populate("patient", "name photo")
    .sort("-createdAt");
  res.json({ success: true, reviews });
};

exports.deleteReview = async (req, res) => {
  await Review.findOneAndDelete({ _id: req.params.id, patient: req.user._id });
  res.json({ success: true, message: "Review deleted" });
};
