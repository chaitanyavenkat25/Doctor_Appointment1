const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

reviewSchema.statics.calcAvgRating = async function (doctorId) {
  const stats = await this.aggregate([
    { $match: { doctor: doctorId } },
    { $group: { _id: "$doctor", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await mongoose.model("Doctor").findByIdAndUpdate(doctorId, {
      rating: stats[0].avgRating.toFixed(1),
      totalRatings: stats[0].count,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.doctor);
});

module.exports = mongoose.model("Review", reviewSchema);
