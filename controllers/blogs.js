const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

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
  .post(middleware.userExtractor, async (request, response, next) => {
    const { body } = request;

    if (!body.title || !body.url) return response.status(400).end();

    try {
      const user = request.user;

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
  .get(async (request, response, next) => {
    const { id } = request.params;

    try {
      const blog = await Blog.findById(id).populate("user", { username: 1, name: 1 });
      response.json(blog);
    } catch (error) {
      next(error);
    }
  })
  .put(middleware.userExtractor, async (request, response, next) => {
    const { id } = request.params;
    const { likes } = request.body;

    try {
      const user = request.user;
      const blog = await Blog.findById(id);

      if (user._id.toString() !== blog.user.toString()) return response.status(401).json({ error: "user invalid" });

      const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true });
      response.json(updatedBlog);
    } catch (error) {
      next(error);
    }
  })
  .delete(middleware.userExtractor, async (request, response, next) => {
    const { id } = request.params;

    try {
      const user = request.user;
      const blog = await Blog.findById(id);

      if (user._id.toString() !== blog.user.toString()) return response.status(401).json({ error: "user invalid" });

      const deletedBlog = await Blog.findByIdAndDelete(id);
      response.json(deletedBlog);
    } catch (error) {
      next(error);
    }
  });

module.exports = blogsRouter;
