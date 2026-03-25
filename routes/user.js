const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { route } = require("./listing");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

// user controller
const usercontroller = require("../controllers/user.js");

router.get("/signup", usercontroller.signuprenderpage);

// signup routes
router.post("/signup", wrapAsync(usercontroller.signup));

// login page
router.get("/login", usercontroller.renderloginform);

// login page logic
router.post(
  "/login",
  saveRedirectUrl, // for path login then again same path
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  usercontroller.login,
);

router.get("/logout", usercontroller.logout);

module.exports = router;
