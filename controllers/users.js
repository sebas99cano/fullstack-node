const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");

usersRouter.get("/", (request, response) => {
  User.find({})
    .populate("notes", { content: 1, date: 1 })
    .then((users) => response.json(users));
});

usersRouter.get("/:id", (request, response, next) => {
  const { id } = request.params;
  User.findById(id)
    .then((user) => {
      if (user) {
        response.json(user);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

usersRouter.post("/", (request, response) => {
  const { body } = request;
  const { userName, name, password } = body;
  const saltRounds = 10;
  const passwordHash = bcrypt.hashSync(password, saltRounds);

  const user = new User({
    userName,
    name,
    passwordHash,
  });

  user.save().then((savedUser) => {
    response.status(201).json(savedUser);
  });
});

module.exports = usersRouter;
