const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter
  .route("/")
  .get(async (request, response, next) => {
    try {
      const allUsers = await User.find({});
      response.json(allUsers);
    } catch (error) {
      next(error);
    }
  })
  .post(async (request, response, next) => {
    const { username, password, name } = request.body;

    try {
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
