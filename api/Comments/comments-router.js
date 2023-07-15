// commentsRouter.js

const express = require("express");
const Comment = require("./comments-model");

const tweetExist = require("../Tweets/TweetsMiddlewares/tweetExist");

const router = express.Router();

router.post("/:tweetId", tweetExist, async (req, res, next) => {
  const { tweetId } = req.params;
  const { comment_text, commented_id } = req.body;

  try {
    const commentId = await Comment.createComment(
      tweetId,
      commented_id,
      comment_text,
      req.tweeted_id
    );

    const newComment = await Comment.getCommentById(commentId);
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

// Get comments by tweet ID
router.get("/:tweetId", async (req, res, next) => {
  const { tweetId } = req.params;

  try {
    const tweet = await Comment.getTweetWithComments(tweetId);

    res.status(200).json(tweet);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
