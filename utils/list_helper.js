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

const mostBlogs = (blogs) => {
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
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
