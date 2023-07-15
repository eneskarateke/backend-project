const db = require("../../data/dbConfig.js");

function getAll() {
  return db("tweets");
}

function getByUserId(userId) {
  return db("tweets")
    .select("tweets.tweet_id", "users.username", "tweets.tweet")
    .from("tweets")
    .join("users", "tweets.user_id", "users.user_id")
    .where("tweets.user_id", userId);
}

function getByTweetId(tweetId) {
  return db("tweets")
    .select(
      "tweets.tweet_id",
      "users.username",
      "users.user_id",
      "tweets.tweet"
    )
    .from("tweets")
    .join("users", "tweets.user_id", "users.user_id")
    .where("tweets.tweet_id", tweetId)
    .first();
}

async function deleteTweet(tweetId) {
  const deletedTweet = await db("tweets")
    .where("tweet_id", tweetId)
    .del()
    .then(() => {
      return db("tweets")
        .select("tweet_id", "tweet")
        .where("tweet_id", tweetId)
        .first();
    });

  return deletedTweet;
}

async function addTweet(userId, tweet) {
  const payload = {
    user_id: userId,
    tweet: tweet,
  };

  const [tweetId] = await db("tweets").insert(payload);
  const addedTweet = await getByTweetId(tweetId);

  return addedTweet;
}
module.exports = {
  getAll,
  getByUserId,
  addTweet,
  getByTweetId,
  deleteTweet,
};
