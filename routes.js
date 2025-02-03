"use strict";

const express = require("express");
const { asyncHandler } = require("./middleware/async-handler");
const { User } = require("./models");
const { authenticateUser } = require("./middleware/auth-user");

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      password: user.password,
    });
  })
);

// Route that creates a new user.
router.post("/users", async (req, res) => {
  try {
    await User.create(req.body);
    res.set("Location", "/");
    res.status(201).json({ message: "Account successfully created!" });
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      console.log("catch if");
      const errors = error.errors.map((err) => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
});

module.exports = router;
