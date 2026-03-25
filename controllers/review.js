const Listing = require("../models/listing");
const Review = require("../models/review");

// create new review
module.exports.createreview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  // console.log(newReview);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  // console.log("new review saved");
  // res.send("your respone saved");
  req.flash("success", "new review Created");

  res.redirect(`/listing/${listing._id}`);
};

// delete review
module.exports.deletereview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "review deleted");
  res.redirect(`/listing/${id}`);
};