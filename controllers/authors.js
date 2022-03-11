const { Blog } = require("../models");
const { sequelize } = require("../models/blog");

const router = require("express").Router();

router.get("/", async (_req, res) => {
  const authors = await Blog.findAll({
    order: [[sequelize.fn("SUM", sequelize.col("likes")), "DESC"]],
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("blog")), "blogs"],
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
    group: "author",
  });
  return res.json(authors);
});

module.exports = router;
