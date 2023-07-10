const express = require("express");
const server = express();
require("dotenv").config();

const helmet = require("helmet");
const cors = require("cors");

const authRouter = require("./Auth/auth-router.js");
const tweetsRouter = require("./Tweets/tweets-router.js");

const usersRouter = require("./Users/users-router.js");
const restricted = require("./middleware/restricted.js");

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/auth", authRouter);
server.use("/api/tweets", tweetsRouter);
server.use("/api/users", restricted, usersRouter);

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
