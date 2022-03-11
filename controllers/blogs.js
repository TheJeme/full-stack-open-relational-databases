const blogRouter = require("express").Router();
const { tokenExtractor } = require("../utils/middlewares");
const { Blog, User } = require("../models");
const { Op } = require("sequelize");

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
    },
    order: [["likes", "DESC"]],
    where: {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search || ""}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search || ""}%`,
          },
        },
      ],
    },
  });
  return res.json(blogs);
});

blogRouter.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.id });
    return res.json(blog);
  } catch (error) {
    console.log(error);
  }
});

blogRouter.delete("/:id", tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (blog) {
    try {
      if (blog.userId === req.decodedToken.id) {
        await blog.destroy();
        return res.json(blog);
      } else {
        return res.status(401).json({ message: "Not authorized." });
      }
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
});

blogRouter.put("/:id", async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    try {
      await blog.update({ ...blog, likes: req.body.likes });
      return res.json(blog);
    } catch (error) {
      next(error);
    }
  } else {
    next({ message: "Blog not found" });
  }
});

module.exports = blogRouter;
