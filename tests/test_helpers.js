const bcrypt = require("bcryptjs");
const Blog = require("../models/blog");

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const initialTestBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

const newBlog = {
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  likes: 12,
};

const newBlogWithoutLikes = {
  title: "First class tests",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
};

const newBlogWithoutTitle = {
  author: "Edsger W. Dijkstra",
  url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  likes: 12,
};

const newBlogWithoutUrl = {
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  likes: 12,
};

const User = require("../models/user");

const userRoot = {
  username: "root",
  password: "secret",
  name: "Name Root",
};

const newUser = {
  username: "nachitofj",
  password: "passNachitofj",
  name: "Ignacio Fernández",
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const clearAndCreateUserRoot = async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash(userRoot.password, 10);

  const newUser = new User({
    username: userRoot.username,
    passwordHash,
    name: userRoot.name,
  });

  await newUser.save();
};

module.exports = {
  blogsInDb,
  initialTestBlogs,
  newBlog,
  newBlogWithoutLikes,
  newBlogWithoutTitle,
  newBlogWithoutUrl,
  userRoot,
  newUser,
  usersInDb,
  clearAndCreateUserRoot,
};
