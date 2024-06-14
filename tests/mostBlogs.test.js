const { test, describe } = require("node:test");
const assert = require("node:assert");
const mostBlogs = require("../utils/list_helper").mostBlogs;
const { emptyBlogs, oneBlog, manyBlogs } = require("./blogs");

describe("Most blogs", () => {
  test("of empty list is empty object", () => {
    assert.deepStrictEqual(mostBlogs(emptyBlogs), { message: "Empty blogs" });
  });

  test("when the list has only one blog", () => {
    assert.deepStrictEqual(mostBlogs(oneBlog), {
      author: "Michael Chan",
      blogs: 1,
    });
  });

  test("of a bigger list is calculated right", () => {
    assert.deepStrictEqual(mostBlogs(manyBlogs), { author: "Robert C. Martin", blogs: 3 });
  });
});
