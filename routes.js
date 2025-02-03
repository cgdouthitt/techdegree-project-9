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
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    console.log("handler");
    console.log(req.body);
    try {
      console.log("try");
      console.log(req.body);
      await User.create(req.body);
      res.status(201).json({ message: "Account successfully created!" });
    } catch (error) {
      console.log("catch");
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        console.log("catch if");
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        console.log("catch else");
        throw error;
      }
    }
  })
);

module.exports = router;
