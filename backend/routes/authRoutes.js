const router = require("express").Router();
const { registerPatient, registerDoctor, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/register/patient", registerPatient);
router.post("/register/doctor", upload.single("photo"), registerDoctor);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
