const db = require("../../data/dbConfig");

async function likeTweet(tweet_id, liked_id, tweetBy) {
  try {
    const payload = {
      tweet_id: tweet_id,
      liked_id: liked_id,
      tweeted_id: tweetBy,
    };

    const [id_like] = await db("likes").insert(payload);
    const newLike = await db("likes")
      .join("tweets", "tweets.tweet_id", "likes.tweet_id")
      .select("likes.*", "tweets.*")
      .where("likes.id_like", id_like)
      .first();

    return newLike;
  } catch (error) {
    throw error;
  }
}
async function unlikeTweet(tweet_id, liked_id) {
  try {
    const deletedLike = await db("likes")
      .where("tweet_id", tweet_id)
      .andWhere("liked_id", liked_id)
      .del();

    return deletedLike;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  likeTweet,
  unlikeTweet,
};
