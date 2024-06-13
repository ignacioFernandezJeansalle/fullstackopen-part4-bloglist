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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
