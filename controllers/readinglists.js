const express = require("express");
const { Readinglist, User, Session } = require("../models/index");
const { tokenExtractor } = require("../utils/middlewares");

const ReadinglistsRouter = express.Router();

ReadinglistsRouter.post("/", async (req, res) => {
  const list = await Readinglist.create(req.body);
  res.json(list);
});

ReadinglistsRouter.put("/:id", tokenExtractor, async (req, res) => {
  const session = Session.findOne({
    where: { userId: req.decodedToken.id },
  });
  const list = await Readinglist.findByPk(req.params.id);
  const user = await User.findByPk(req.decodedToken.id);

  if (!list) {
    res.send(404).end();
  } else if (list.userId !== user.id || !session) {
    res.status(401).end();
  } else {
    list.read = req.body.read;
    await list.save();
    res.json(list);
  }
});

module.exports = ReadinglistsRouter;
