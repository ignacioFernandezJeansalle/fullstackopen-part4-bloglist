const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info("-----");
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("-----");
  next();
};

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: "Unknown endpoint" });
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }

  next();
};

const userExtractor = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!decodedToken.id) {
      res.status(401).json({ error: "token invalid" });
    }

    req.user = await User.findById(decodedToken.id);
  } catch (error) {
    next(error);
  }

  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.name);
  logger.error(error.message);

  if (error.name === "CastError") return res.status(400).send({ error: "malformatted id" });

  if (error.name === "ValidationError") return res.status(400).json({ error: error.message });

  if (error.name === "MongoServerError" && error.message.includes("E11000 duplicate key error"))
    return res.status(400).json({ error: "Expected username to be unique" });

  if (error.name === "JsonWebTokenError") return res.status(401).json({ error: "token invalid" });

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
  errorHandler,
};
