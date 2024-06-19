const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const supertest = require("supertest");
const helpers = require("./test_helpers");
const app = require("../app");

const api = supertest(app);

describe("When there is initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    //console.log("DB Test cleared");
    await Blog.insertMany(helpers.initialTestBlogs);
    //console.log("DB initial test blogs saved");
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helpers.initialTestBlogs.length);
  });

  test("identifier property is named id", async () => {
    await api.get("/api/blogs").expect((res) => {
      if (!res.body[0].id) throw new Error("missing id key");
    });
  });
});

describe("Addition of a new blog", () => {
  test("succeeds with valid data", async () => {
    await api
      .post("/api/blogs")
      .send(helpers.newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect((response) => {
        assert.strictEqual(response.body.title, helpers.newBlog.title);
      });

    const blogsInDb = await helpers.blogsInDb();
    assert.strictEqual(blogsInDb.length, helpers.initialTestBlogs.length + 1);
  });

  test("without the likes property then likes equals 0", async () => {
    await api
      .post("/api/blogs")
      .send(helpers.newBlogWithoutLikes)
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect((response) => {
        assert.strictEqual(response.body.likes, 0);
      });
  });

  test("bad request 400 without title or url property", async () => {
    await api.post("/api/blogs").send(helpers.newBlogWithoutTitle).expect(400);

    await api.post("/api/blogs").send(helpers.newBlogWithoutUrl).expect(400);
  });
});

describe("Deletion of a blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsInDbBeforeDelete = await helpers.blogsInDb();
    const blogToDelete = blogsInDbBeforeDelete[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(200)
      .expect((response) => {
        assert.deepStrictEqual(response.body, blogToDelete);
      });

    const blogsInDbAfterDelete = await helpers.blogsInDb();
    assert.strictEqual(blogsInDbBeforeDelete.length - 1, blogsInDbAfterDelete.length);
  });
});

describe("Updating of a blog", () => {
  test("succeeds with status code 200 updating likes + 1", async () => {
    const blogsInDb = await helpers.blogsInDb();

    const blogToUpdate = blogsInDb[0];
    blogToUpdate.likes = blogToUpdate.likes + 1;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect((response) => {
        assert.deepStrictEqual(response.body.likes, blogToUpdate.likes);
      });
  });
});

after(async () => {
  await mongoose.connection.close();
});
