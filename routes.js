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
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  })
);

// Route that creates a new user.
router.post("/users", async (req, res) => {
  try {
    await User.create(req.body);
    res.set("Location", "/");
    res.status(201).json();
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
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
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
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
      ],
    });
    res.json(course);
  })
);

// Route that creates a new course.
router.post("/courses", authenticateUser, async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.set("Location", `/courses/${newCourse.id}`);
    res.status(201).json();
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

// Route that updates a course.
router.put("/courses/:id", authenticateUser, async (req, res) => {
  const id = req.params.id;
  const authUserId = req.currentUser.dataValues.id;
  const course = await Course.findByPk(id, {
    attributes: ["userId"],
  });
  const userId = course.dataValues.userId;
  if (authUserId !== userId) {
    res.status(403).json({ message: "Invalid Owner" });
  } else {
    try {
      await Course.update(req.body, { where: { id: id } });
      res.status(204).json();
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
  }
});

// Route that deletes a course.
router.delete("/courses/:id", authenticateUser, async (req, res) => {
  const id = req.params.id;
  const authUserId = req.currentUser.dataValues.id;
  const course = await Course.findByPk(id, {
    attributes: ["userId"],
  });
  const userId = course.dataValues.userId;
  if (authUserId !== userId) {
    res.status(403).json({ message: "Invalid Owner" });
  } else {
    try {
      await Course.destroy({ where: { id: id } });
      res.status(204).json();
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
  }
});

module.exports = router;
