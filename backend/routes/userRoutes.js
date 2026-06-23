const router = require("express").Router();
const { updateProfile, changePassword, getMyAppointments } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);
router.put("/profile", upload.single("photo"), updateProfile);
router.put("/change-password", changePassword);
router.get("/appointments", getMyAppointments);

module.exports = router;
