const express = require("express");
const { likeTweet, unlikeTweet } = require("./likes-model");
const TweetModel = require("../Tweets/tweets-model");
const likeExist = require("../middleware/likeExist");
const tweetExist = require("../Tweets/TweetsMiddlewares/tweetExist");

const router = express.Router();

// Like a tweet
router.post("/:tweetId", tweetExist, likeExist, async (req, res, next) => {
  try {
    const tweetId = req.params.tweetId;
    const likedId = req.body.liked_id;

    const newLike = await likeTweet(tweetId, likedId, req.tweeted_id);

    return res.json(newLike);
  } catch (error) {
    next(error);
  }
});

router.delete("/:tweetId", async (req, res, next) => {
  try {
    const tweetId = req.params.tweetId;
    const likedId = req.body.liked_id;

    const deletedLike = await unlikeTweet(tweetId, likedId);

    if (!deletedLike) {
      res.json({ message: "There is no such a like!" });
    } else {
      return res.json({ message: "Like has been undone!" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
