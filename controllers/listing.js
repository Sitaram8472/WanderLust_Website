const Listing = require("../models/listing");

// all list image
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
};

// craete new routes form
module.exports.shownewform = (req, res) => {
  res.render("listing/new.ejs");
};

// show routes
module.exports.showroutes = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "This listing does not exist!");
    return res.redirect("/listing");
  }
  // console.log(listing);
  res.render("listing/show.ejs", { listing });
};

// craete new listing
module.exports.createnewroutes = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, +"..." + filename);

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
  // let resultfromvalidation = listingSchema.validate(req.body);
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
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "new Listing Created");
  res.redirect("/listing");
};

// edit routes logic
module.exports.editroutes = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "This listing does not exist!");
    return res.redirect("/listing");
  }
  let originalimageurl = listing.image.url;
  originalimageurl = originalimageurl.replace("/upload", "/upload/w_250");
  res.render("listing/edit.ejs", { listing, originalimageurl });
};

// update routes
module.exports.updaterouter = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  // prevent empty image overwrite
  // if (!updateData.image) {
  //   delete updateData.image;
  // }

  // await Listing.findByIdAndUpdate(id, listing);
  req.flash("success", "update listing");
  res.redirect(`/listing/${id}`);
};

// delete routes
module.exports.deleteroutes = async (req, res) => {
  let { id } = req.params;
  let deletelisting = await Listing.findByIdAndDelete(id);
  req.flash("success", "delete Listing");
  // console.log(deletelisting);
  res.redirect("/listing");
};
