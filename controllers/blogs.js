const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter
  .route("/")
  .get(async (request, response, next) => {
    try {
      const allBlogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
      response.json(allBlogs);
    } catch (error) {
      next(error);
    }
  })
  .post(async (request, response, next) => {
    const { body } = request;

    if (!body.title || !body.url) return response.status(400).end();

    try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET);
      if (!decodedToken.id) {
        return response.status(401).json({ error: "token invalid" });
      }

      const user = await User.findById(decodedToken.id);

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: !body.likes ? 0 : parseInt(body.likes),
        user: user._id,
      });

      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();

      response.status(201).json(savedBlog);
    } catch (error) {
      next(error);
    }
  });

blogsRouter
  .route("/:id")
  .put(async (request, response, next) => {
    const { id } = request.params;
    const { likes } = request.body;

    try {
      const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true });
      response.json(updatedBlog);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (request, response, next) => {
    const { id } = request.params;

    try {
      const deletedBlog = await Blog.findByIdAndDelete(id);
      response.json(deletedBlog);
    } catch (error) {
      next(error);
    }
  });

module.exports = blogsRouter;
