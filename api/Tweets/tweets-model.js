const db = require("../../data/dbConfig.js");

function getAll() {
  return db("tweets");
}

function getByUserId(userId) {
  return db("tweets")
    .select("users.username", "tweets.tweet")
    .from("tweets")
    .join("users", "tweets.user_id", "users.user_id")
    .where("tweets.user_id", userId);
}

module.exports = {
  getAll,
  getByUserId,
};
