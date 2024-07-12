const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const supertest = require("supertest");
const helpers = require("./test_helpers");
const app = require("../app");

const api = supertest(app);

const getTokenRoot = async () => {
  const result = await api.post("/api/login").send(helpers.userRoot);
  return "Bearer " + result.body.token;
};

describe("When there is initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helpers.initialTestBlogs);
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

  after(async () => {
    await Blog.deleteMany({});
  });
});

describe("Addition of a new blog", () => {
  beforeEach(async () => {
    await helpers.clearAndCreateUserRoot();
  });

  test("succeeds with valid data", async () => {
    const token = await getTokenRoot();

    await api
      .post("/api/blogs")
      .send(helpers.newBlog)
      .set({ Authorization: token })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect((response) => {
        assert.strictEqual(response.body.title, helpers.newBlog.title);
      });

    const blogsInDb = await helpers.blogsInDb();
    assert.strictEqual(blogsInDb.length, 1);
  });

  test("without the likes property then likes equals 0", async () => {
    const token = await getTokenRoot();

    await api
      .post("/api/blogs")
      .send(helpers.newBlogWithoutLikes)
      .set({ Authorization: token })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect((response) => {
        assert.strictEqual(response.body.likes, 0);
      });
  });

  test("bad request 400 without title or url property", async () => {
    const token = await getTokenRoot();

    await api.post("/api/blogs").send(helpers.newBlogWithoutTitle).set({ Authorization: token }).expect(400);

    await api.post("/api/blogs").send(helpers.newBlogWithoutUrl).set({ Authorization: token }).expect(400);
  });

  test("unauthorized 401 without token", async () => {
    await api
      .post("/api/blogs")
      .send(helpers.newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/)
      .expect((response) => {
        assert.strictEqual(response.body.error, "token invalid");
      });
  });
});

describe("Deletion of a blog", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await helpers.clearAndCreateUserRoot();
  });

  test("succeeds with status code 200 if id is valid", async () => {
    const token = await getTokenRoot();

    await api.post("/api/blogs").send(helpers.newBlog).set({ Authorization: token });

    const blogsInDbBeforeDelete = await helpers.blogsInDb();
    const blogToDelete = {
      ...blogsInDbBeforeDelete[0],
      user: blogsInDbBeforeDelete[0].user.toString(),
    };

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: token })
      .expect(200)
      .expect((response) => {
        assert.deepStrictEqual(response.body, blogToDelete);
      });

    const blogsInDbAfterDelete = await helpers.blogsInDb();
    assert.strictEqual(blogsInDbBeforeDelete.length - 1, blogsInDbAfterDelete.length);
  });

  test("unauthorized 401 without token", async () => {
    const token = await getTokenRoot();
    await api.post("/api/blogs").send(helpers.newBlog).set({ Authorization: token });

    const blogsInDbBeforeDelete = await helpers.blogsInDb();
    const blogToDelete = {
      ...blogsInDbBeforeDelete[0],
      user: blogsInDbBeforeDelete[0].user.toString(),
    };

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
      .expect("Content-Type", /application\/json/)
      .expect((response) => {
        assert.strictEqual(response.body.error, "token invalid");
      });
  });
});

describe("Updating of a blog", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await helpers.clearAndCreateUserRoot();
  });

  test("succeeds with status code 200 updating likes + 1", async () => {
    const token = await getTokenRoot();
    await api.post("/api/blogs").send(helpers.newBlog).set({ Authorization: token });

    const blogsInDb = await helpers.blogsInDb();

    const blogToUpdate = {
      ...blogsInDb[0],
      likes: blogsInDb[0].likes + 1,
      user: blogsInDb[0].user.toString(),
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .set({ Authorization: token })
      .expect(200)
      .expect((response) => {
        assert.deepStrictEqual(response.body, blogToUpdate);
      });
  });

  test("unauthorized 401 without token", async () => {
    const token = await getTokenRoot();
    await api.post("/api/blogs").send(helpers.newBlog).set({ Authorization: token });

    const blogsInDb = await helpers.blogsInDb();

    const blogToUpdate = {
      ...blogsInDb[0],
      likes: blogsInDb[0].likes + 1,
      user: blogsInDb[0].user.toString(),
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(401)
      .expect("Content-Type", /application\/json/)
      .expect((response) => {
        assert.strictEqual(response.body.error, "token invalid");
      });
  });
});

after(async () => {
  await mongoose.connection.close();
});
