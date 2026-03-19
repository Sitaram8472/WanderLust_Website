const express = require("express");
const router = express.Router();

// index
// post
router.get("/", (req, res) => {
  res.send("get for posts");
});

// show user
router.get("/:id", (req, res) => {
  res.send("show for user");
});

// post user
router.post("/", (req, res) => {
  res.send("post for posts");
});

// delete
router.delete("/:id", (req, res) => {
  res.send("delete for posts");
});
