"use strict";

const express = require("express");
const { asyncHandler } = require("./middleware/async-handler");
const { User, Course } = require("./models");
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
      const errors = error.errors.map((err) => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
});

// Route that returns a list of courses.
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
    res.json(courses);
  })
);

// Route that returns a  course based on the id.
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
        },
      ],
    });
    res.json(course);
  })
);

// Route that creates a new course.
router.post("/courses", async (req, res) => {
  try {
    await Course.create(req.body);
    res.set("Location", "/courses/");
    res.status(201).json({ message: "Course successfully created!" });
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
});

module.exports = router;
