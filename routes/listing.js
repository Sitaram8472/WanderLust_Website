const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// validationschema through middleware of listingScgema
const validatelistingmiddleware = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

// index routes
router.get(
  "/",
  warpAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  }),
);

// create new and create route
router.get("/new", (req, res) => {
  res.render("listing/new.ejs");
});

// show routes
router.get(
  "/:id",
  warpAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "This listing does not exist!");
      return res.redirect("/listing");
    }
    res.render("listing/show.ejs", { listing });
  }),
);

// Create new route
router.post(
  "/",
  validatelistingmiddleware,
  warpAsync(async (req, res, next) => {
    let { listing } = req.body;

    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Listing data is required");
    // }
    // // validation in scehma
    // if (!listing.title) {
    //   throw new ExpressError(400, "title is missing");
    // }
    // if (!listing.description) {
    //   throw new ExpressError(400, "description is missing");
    // }
    // if (!listing.price) {
    //   throw new ExpressError(400, "price is missing");
    // }

    // validation schema
    let resultfromvalidation = listingSchema.validate(req.body);
    // console.log(resultfromvalidation);
    // if (resultfromvalidation.error) {
    //   throw new ExpressError(400, resultfromvalidation.error);
    // }

    // Check if the user provided an image URL
    if (listing.image && typeof listing.image === "string") {
      // Convert the string URL into the object structure your schema expects
      listing.image = {
        url: listing.image,
        filename: "listingimage", // You can set a default filename
      };
    }

    const newListing = new Listing(listing);
    await newListing.save();
    req.flash("success", "new Listing Created");
    res.redirect("/listing");
  }),
);

// edit route
router.get(
  "/:id/edit",
  warpAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "This listing does not exist!");
      return res.redirect("/listing");
    }
    res.render("listing/edit.ejs", { listing });
  }),
);

// update route
router.put(
  "/:id",
  validatelistingmiddleware,
  warpAsync(async (req, res) => {
    let { id } = req.params;
    let updateData = { ...req.body.listing };

    // prevent empty image overwrite
    if (!updateData.image) {
      delete updateData.image;
    }

    await Listing.findByIdAndUpdate(id, updateData);
    req.flash("success", "update listing");
    res.redirect(`/listing/${id}`);
  }),
);

// delete route
router.delete(
  "/:id",
  warpAsync(async (req, res) => {
    let { id } = req.params;
    let deletelisting = await Listing.findByIdAndDelete(id);
    req.flash("success", "delete Listing");
    // console.log(deletelisting);
    res.redirect("/listing");
  }),
);

module.exports = router;
