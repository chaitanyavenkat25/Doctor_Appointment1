const router = require("express").Router();
const {
  getDashboardStats, getAllDoctors, approveDoctorStatus, toggleDoctorActive,
  getAllPatients, togglePatientActive, getAllAppointments, deleteDoctor,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));
router.get("/dashboard", getDashboardStats);
router.get("/doctors", getAllDoctors);
router.put("/doctors/:id/approval", approveDoctorStatus);
router.put("/doctors/:id/toggle", toggleDoctorActive);
router.delete("/doctors/:id", deleteDoctor);
router.get("/patients", getAllPatients);
router.put("/patients/:id/toggle", togglePatientActive);
router.get("/appointments", getAllAppointments);

module.exports = router;
