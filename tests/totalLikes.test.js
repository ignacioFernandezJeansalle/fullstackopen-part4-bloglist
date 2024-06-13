const { test, describe } = require("node:test");
const assert = require("node:assert");
const totalLikes = require("../utils/list_helper").totalLikes;
const { emptyBlogs, oneBlog, manyBlogs } = require("./blogs");

describe("Total likes", () => {
  test("of empty list is zero", () => {
    assert.strictEqual(totalLikes(emptyBlogs), 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    assert.strictEqual(totalLikes(oneBlog), 7);
  });

  test("of a bigger list is calculated right", () => {
    assert.strictEqual(totalLikes(manyBlogs), 36);
  });
});
