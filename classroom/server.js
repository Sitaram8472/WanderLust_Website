const express = require("express");
const app = express();
const users = require("./routes/user.js");
const post = require("./routes/post.js");
const cookiesparser = require("cookie-parser");
const session = require("express-session");
const { name } = require("ejs");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// expres session
// app.use(cookiesparser("secretcode"));

const sessionOption = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next) => {
  res.locals.successmsg = req.flash("success");
  res.locals.errormsg = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  // console.log(req.session);
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error", "user not register");
  } else {
    req.flash("success", "user regitsered successfully");
  }

  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  // res.send(`hello  , ${(req.session.name)}`);
  // console.log(req.flash("success"));
  // res.locals.successmsg = req.flash("success");
  // res.locals.errormsg = req.flash("error");
  res.render("page.ejs", { name: req.session.name });
  // res.render("page.ejs", { name: req.session.name, msg: req.flash("success") });
});

// app.use(
//   session({
//     secret: "mysupersecretstring",
//     resave: false,
//     saveUninitialized: true,
//   }),
// );
// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }

//   res.send(` you sent request ${req.session.count} times`);
// });

// app.get("/test", (req, res) => {
//   res.send("test successful");
// });

// cookies
// app.get("/signedcookies", (req, res) => {
//   res.cookie("made-in", "india", { signed: true });
//   res.send("signed cookies send");
// });

// app.get("/verify", (req, res) => {
//   console.log(req.cookies);
//   res.send("verifed");
// });

// app.get("/getcookies", (req, res) => {
//   res.cookie("greet", "Hello");
//   res.cookie("hi", "howareyou");
//   res.send("this is cookies section");
// });

// app.get("/greet", (req, res) => {
//   let { name = "anonymous" } = req.cookies;
//   res.send(`Hi my name is ${name}`);
// });

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("i am root");
// });

// app.use("/users", users); // this route handle all user routes
// app.use("/posts", users); // this route handle all post routes

// meaning full route
// // users
// app.get("/users", (req, res) => {
//   res.send("get for users");
// })

// // show user
// app.get("/users/:id", (req, res) => {
//   res.send("show for user id")
// })

// // post user
// app.post("/users", (req, res) => {
//   res.send("post for user");
// })

// // delete
// app.delete("/users/:id", (req, res) => {
//   res.send("delete for users");
// })

// // index
// // post
// app.get("/posts", (req, res) => {
//   res.send("get for posts");
// });

// // show user
// app.get("/posts/:id", (req, res) => {
//   res.send("show for user");
// });

// // post user
// app.post("/posts", (req, res) => {
//   res.send("post for posts");
// });

// // delete
// app.delete("/posts/:id", (req, res) => {
//   res.send("delete for posts");
// });

app.listen(3000, (req, res) => {
  console.log("server is started port 3000");
});
