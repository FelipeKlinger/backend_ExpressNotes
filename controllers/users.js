const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const { User } = require("../models/users");
const { request, response } = require("../app");

usersRouter.post("/", async (request, reponse) => {
  const { username, name, password } = request.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
