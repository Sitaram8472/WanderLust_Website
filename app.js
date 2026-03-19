const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const warpAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync");
const review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passpoerStrategy = require("passport-local");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local").Strategy;

// router
const listingrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// data access form models and send in index.ejs index route
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionoption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// coookies
app.use(session(sessionoption));
// flash message
app.use(flash());
// AUTHENITICATE
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // console.log(res.locals.success);
  next();
});

// for authenticate
app.get("/demouser", async (req, res) => {
  let fakeuser = new User({
    email: "student@gmail.com",
    username: "delta-student",
  });

  let registrationUser = await User.register(fakeuser, "helloworld");
  res.send(registrationUser);
});

// listing routes
app.use("/listing", listingrouter);
app.use("/listing/:id/reviews", reviewsrouter);
app.use("/", userrouter);

// app.get("/testListing", async (req, res) => {
//   let samplelisting = new Listing({
//     title: "my new vills",
//     description: "by the beach",
//     price: 5480,
//     location: "kolkata",         3

//     county: "india",
//   });

//   await samplelisting.save();
//   console.log("sample was save");
//   res.send("successful data tetsing");
// });

// universe default route if no above are run then this run
// app.all("/*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// for default error server side
// app.use((err, req, res, next) => {
//   res.send("some thing was wrong");
// });

// express error
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Somethind went wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("started server 8080");
});
