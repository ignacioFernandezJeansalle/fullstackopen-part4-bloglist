const express = require("express");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blogs");
const config = require("./utils/config");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) => logger.error("Error connecting to MongoDB: ", error.message));

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);

module.exports = app;
