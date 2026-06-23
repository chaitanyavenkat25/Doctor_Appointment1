const router = require("express").Router();
const {
  getAllDoctors, getDoctorById, updateDoctorProfile, setAvailability,
  getDoctorAppointments, updateAppointmentStatus, getDoctorStats, getSpecializations,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public routes — specific paths first, wildcard last
router.get("/", getAllDoctors);
router.get("/specializations", getSpecializations);

// Doctor protected routes — must be before /:id
router.put("/profile/update", protect, authorize("doctor"), upload.single("photo"), updateDoctorProfile);
router.put("/availability", protect, authorize("doctor"), setAvailability);
router.get("/appointments/my", protect, authorize("doctor"), getDoctorAppointments);
router.put("/appointments/:id/status", protect, authorize("doctor"), updateAppointmentStatus);
router.get("/dashboard/stats", protect, authorize("doctor"), getDoctorStats);

// Wildcard — must be last
router.get("/:id", getDoctorById);

module.exports = router;
