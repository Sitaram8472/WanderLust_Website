const express = require("express");
const router = express.Router();

// users
router.get("/", (req, res) => {
  res.send("get for users");
});

// show user
router.get("/:id", (req, res) => {
  res.send("show for user id");
});

// post user
router.post("/", (req, res) => {
  res.send("post for user");
});

// delete
router.delete("/:id", (req, res) => {
  res.send("delete for users");
});


module.exports = router;