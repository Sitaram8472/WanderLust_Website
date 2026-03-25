const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validatereview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewares.js");

// review controller
const reviewcontroller = require("../controllers/review.js");

// Review route
//post route
router.post(
  "/",
  isLoggedIn,
  validatereview,
  wrapAsync(reviewcontroller.createreview),
);

// delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewcontroller.deletereview),
);

module.exports = router;
