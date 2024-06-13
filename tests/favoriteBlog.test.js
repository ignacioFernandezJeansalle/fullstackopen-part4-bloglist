const { test, describe } = require("node:test");
const assert = require("node:assert");
const favoriteBlog = require("../utils/list_helper").favoriteBlog;
const { emptyBlogs, oneBlog, manyBlogs } = require("./blogs");

describe("Favorite blog", () => {
  test("of empty list is empty object", () => {
    assert.deepStrictEqual(favoriteBlog(emptyBlogs), { message: "Empty blogs" });
  });

  test("when the list has only one blog", () => {
    assert.deepStrictEqual(favoriteBlog(oneBlog), {
      id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    });
  });

  test("of a bigger list is calculated right", () => {
    assert.deepStrictEqual(favoriteBlog(manyBlogs), {
      id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    });
  });
});
