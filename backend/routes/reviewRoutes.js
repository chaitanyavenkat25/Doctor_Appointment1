const router = require("express").Router();
const { addReview, getDoctorReviews, deleteReview } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth");

router.get("/doctor/:doctorId", getDoctorReviews);
router.post("/", protect, authorize("patient"), addReview);
router.delete("/:id", protect, authorize("patient"), deleteReview);

module.exports = router;
