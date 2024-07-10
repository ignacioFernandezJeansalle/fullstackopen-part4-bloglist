const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter
  .route("/")
  .get(async (request, response, next) => {
    try {
      const allUsers = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1 });
      response.json(allUsers);
    } catch (error) {
      next(error);
    }
  })
  .post(async (request, response, next) => {
    const { username, password, name } = request.body;

    try {
      if (!password) {
        const newError = new Error("User validation failed: `password` is required.");
        newError.name = "ValidationError";
        throw newError;
      }

      if (password.length < 3) {
        const newError = new Error(
          "User validation failed: password: Path `password` is shorter than the minimum allowed length (3)"
        );
        newError.name = "ValidationError";
        throw newError;
      }

      const salt = 10;
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        passwordHash,
        name,
      });

      const savedUser = await newUser.save();

      response.status(201).json(savedUser);
    } catch (error) {
      next(error);
    }
  });

module.exports = usersRouter;
