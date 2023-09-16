const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/User");

loginRouter.post("/", async (request, response) => {
  const { body } = request;
  const { userName, password } = body;

  const user = await User.findOne({ userName });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    response.status(401).json({
      error: "invalid user or password",
    });
  }

  response.send({
    name: user.name,
    userName: user.userName,
  });
});

module.exports = loginRouter;
