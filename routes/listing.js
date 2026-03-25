const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/wrapAsync");

const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  isOwner,
  validatelistingmiddleware,
} = require("../middlewares.js");

// controller requires
const listingcontroller = require("../controllers/listing.js");

// for file/ image uplaad
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
// const upload = multer({ dest: "uploads/" });

// here is implemented router.route
router
  .route("/")
  .get(warpAsync(listingcontroller.index)) // index routes
  .post(
    isLoggedIn,
    validatelistingmiddleware,
    upload.single("listing[image]"),
    warpAsync(listingcontroller.createnewroutes),
  ); // Create new route
  // .post(upload.single("listing[image]"), (req, res) => {
  //   res.send(req.file);
  // });
 
// end her router.route

// create new and create route
router.get("/new", isLoggedIn, listingcontroller.shownewform);

router
  .route("/:id")
  .get(warpAsync(listingcontroller.showroutes)) // show routes
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validatelistingmiddleware,
    warpAsync(listingcontroller.updaterouter),
  ) // update route
  .delete(isLoggedIn, isOwner, warpAsync(listingcontroller.deleteroutes)); // delete route

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  warpAsync(listingcontroller.editroutes),
);

module.exports = router;
