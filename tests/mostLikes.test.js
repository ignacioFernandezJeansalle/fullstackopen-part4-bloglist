const { test, describe } = require("node:test");
const assert = require("node:assert");
const mostLikes = require("../utils/list_helper").mostLikes;
const { emptyBlogs, oneBlog, manyBlogs } = require("./blogs");

describe("Most likes", () => {
  test("of empty list is empty object", () => {
    assert.deepStrictEqual(mostLikes(emptyBlogs), { message: "Empty blogs" });
  });

  test("when the list has only one blog", () => {
    assert.deepStrictEqual(mostLikes(oneBlog), { author: "Michael Chan", likes: 7 });
  });

  test("of a bigger list is calculated right", () => {
    assert.deepStrictEqual(mostLikes(manyBlogs), { author: "Edsger W. Dijkstra", likes: 17 });
  });
});
