const express = require("express");
const server = express();
require("dotenv").config();

const helmet = require("helmet");
const cors = require("cors");

const authRouter = require("./Auth/auth-router.js");
const tweetsRouter = require("./Tweets/tweets-router.js");
const followersRouter = require("./Followers/followers-router.js");
const likesRouter = require("./Likes/likes-router.js");
const commentsRouter = require("./Comments/comments-router.js");

const usersRouter = require("./Users/users-router.js");
const restricted = require("./middleware/restricted.js");

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/auth", authRouter);
server.use("/api/tweets", restricted, tweetsRouter);
server.use("/api/users", usersRouter);
server.use("/api/likes", likesRouter);
server.use("/api/comments", commentsRouter);

server.use("/api/followers", restricted, followersRouter);

server.get("/", (req, res) => {
  res.json({ message: "Server up and running..." });
});

server.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
