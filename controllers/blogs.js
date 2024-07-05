const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter
  .route("/")
  .get(async (request, response, next) => {
    try {
      const allBlogs = await Blog.find({});
      response.json(allBlogs);
    } catch (error) {
      next(error);
    }
  })
  .post(async (request, response, next) => {
    const blog = new Blog(request.body);

    if (!blog.title || !blog.url) return response.status(400).end();

    if (!blog.likes) blog.likes = 0;

    try {
      const savedBlog = await blog.save();
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
