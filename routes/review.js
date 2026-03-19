const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// validationschema through middleware of review
const validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

// Review route
//post route
router.post(
  "/",
  validatereview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    // res.send("your respone saved");
    req.flash("success", "new review Created");

    res.redirect(`/listing/${listing._id}`);
  }),
);
// delte review route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "nreview deleted");
    res.redirect(`/listing/${id}`);
  }),
);

module.exports = router;
