const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();

const { SECRET } = require("../utils/config");
const User = require("../models/user");
const Session = require("../models/session");

loginRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = await User.findOne({ where: { username: body.username } });

  const passwordCorrect = body.password === "salainen";

  if (!(user && passwordCorrect)) {
    console.log(body);
    return response.json(401).json({ error: "invalid username or password" });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);
  const sessions = await Session.findAll({});
  const sessionValues = sessions.map((s) => {
    return `${s.dataValues.userId}`;
  });
  if (!sessionValues.includes(`${user.id}`)) {
    await Session.create({
      token: token,
      userId: user.id,
    });
    return response
      .status(200)
      .send({ token, username: user.username, name: user.name });
  } else {
    return response
      .status(200)
      .json({ error: "user already logged in", token });
  }
});

module.exports = loginRouter;
