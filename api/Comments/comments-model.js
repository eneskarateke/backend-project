// comments-model.js

const db = require("../../data/dbConfig");

const TweetModel = require("../Tweets/tweets-model");

async function createComment(tweetId, commentedId, commentText, tweeted_id) {
  try {
    const tweet = await TweetModel.getByTweetId(tweetId);

    if (!tweet) {
      throw new Error("Tweet not found");
    }

    const [commentId] = await db("comments").insert({
      tweet_id: tweetId,
      tweeted_id: tweeted_id,
      commented_id: commentedId || null,
      comment_text: commentText,
    });

    return commentId;
  } catch (error) {
    throw new Error("Failed to create comment");
  }
}

async function getCommentById(commentId) {
  try {
    const comment = await db("comments")
      .select()
      .where("id_comment", commentId)
      .first();

    return comment;
  } catch (error) {
    throw new Error("Failed to retrieve comment");
  }
}

async function getTweetWithComments(tweetId) {
  try {
    const tweet = await db("tweets")
      .join("users", "tweets.user_id", "=", "users.user_id")
      .select("tweets.*", "users.username as tweeted_by")
      .where("tweet_id", tweetId)
      .first();

    if (!tweet) {
      throw new Error("Tweet not found");
    }

    const comments = await db("comments")
      .select()
      .where("tweet_id", tweetId)
      .orderBy("created_at", "desc");

    tweet.comments = comments;

    return { tweet };
  } catch (error) {
    throw new Error("Failed to retrieve tweet and comments");
  }
}

module.exports = { createComment, getCommentById, getTweetWithComments };
