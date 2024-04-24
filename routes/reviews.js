const express = require("express");

const {
    getReviews,
    getReview,
    addReview,
    getAverageRating,
} = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

router
    .route("/")
    .get(protect, getReviews)
    .post(protect, authorize("admin", "user"), addReview);

router
    .route("/:id")
    .get(protect, getReview);

router
    .route("/avgrating/:id")
    .get(getAverageRating)

module.exports = router;