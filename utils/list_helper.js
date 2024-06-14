const dummy = (_blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (favoriteBlog, blog) => {
    if (!favoriteBlog.likes || favoriteBlog.likes < blog.likes) return blog;

    return favoriteBlog;
  };

  return blogs.length === 0 ? { message: "Empty blogs" } : blogs.reduce(reducer, {});
};

// without lodash library
/* const mostBlogs = (blogs) => {
  if (blogs.length === 0) return { message: "Empty blogs" };

  const blogsByAuthor = blogs.reduce((result, blog) => {
    result[blog.author] = result[blog.author] || 0;
    result[blog.author] += 1;

    return result;
  }, []);

  let mostBlogs = { blogs: 0 };

  for (const [author, blogs] of Object.entries(blogsByAuthor)) {
    mostBlogs = mostBlogs.blogs < blogs ? { author, blogs } : mostBlogs;
  }

  return mostBlogs;
}; */

// with lodash library
const lodash = require("lodash");
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return { message: "Empty blogs" };

  const blogsByAuthor = lodash.countBy(blogs, "author");

  const reducerMostBlogs = (result, value, key) => {
    if (result.blogs < value) result = { author: key, blogs: value };
    return result;
  };

  const mostBlogs = lodash.reduce(blogsByAuthor, reducerMostBlogs, { blogs: 0 });

  return mostBlogs;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return { message: "Empty blogs" };

  const authorMostLikes = blogs.reduce((result, blog) => {
    result[blog.author] = result[blog.author] || 0;
    result[blog.author] += blog.likes;

    return result;
  }, []);

  let mostLikes = { likes: 0 };

  for (const [author, likes] of Object.entries(authorMostLikes)) {
    mostLikes = mostLikes.likes < likes ? { author, likes } : mostLikes;
  }

  return mostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
