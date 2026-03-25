const User = require("../models/user");


// rener signup form
module.exports.signuprenderpage = (req, res) => {
  res.render("users/signup.ejs");
};

// signup logic
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "signup successful, Welcome to wanderlust");
      res.redirect("/listing");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

// render login form
module.exports.renderloginform = (req, res) => {
  res.render("users/login.ejs");
};

// login render logic
module.exports.login = async (req, res) => {
  req.flash("success", "successful login");
  let redirectUrl = res.locals.redirectUrl || "/listing"; // for path login then again same path
  res.redirect(redirectUrl);
};

// logot
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listing");
  });
};
