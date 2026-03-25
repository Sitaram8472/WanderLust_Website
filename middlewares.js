const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path, "..", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // for path login then again same path
    req.flash("error", "please login to create new listing");
    return res.redirect("/login");
  }
  next();
};

// for path login redirect on same path
module.exports.saveRedirectUrl = (req, res, next) => {
  // for path login then again same path
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// for permission to access
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listings = await Listing.findById(id);
  if (!listings.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you don't have to access to edit");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

// validationschema through middleware of listingSchema
module.exports.validatelistingmiddleware = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

// validationschema through middleware of review
module.exports.validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

// review delete
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you don't have to access to review");
    return res.redirect(`/listing/${id}`);
  }
  next();
};
