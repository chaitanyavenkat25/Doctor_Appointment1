const router = require("express").Router();
const { bookAppointment, cancelAppointment, rescheduleAppointment } = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("patient"));
router.post("/book", bookAppointment);
router.put("/:id/cancel", cancelAppointment);
router.put("/:id/reschedule", rescheduleAppointment);

module.exports = router;
