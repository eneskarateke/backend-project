const express = require("express");
const { likeTweet, unlikeTweet } = require("./likes-model");
const likeExist = require("../middleware/likeExist");

const router = express.Router();

// Like a tweet
router.post("/:tweetId", likeExist, async (req, res, next) => {
  try {
    const tweetId = req.params.tweetId;
    const likedId = req.body.liked_id;

    const newLike = await likeTweet(tweetId, likedId);

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
      res.json({ message: "Like bulunamadı" });
    } else {
      return res.json({ message: "Like has been undone" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
