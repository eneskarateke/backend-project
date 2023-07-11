const router = require("express").Router();
const Tweets = require("./tweets-model.js");

// Define routes
router.get("/", async (req, res, next) => {
  try {
    const tweets = await Tweets.getAll();
    res.json(tweets);
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const tweets = await Tweets.getByUserId(userId);
    res.json(tweets);
  } catch (error) {
    next(error);
  }
});

router.post("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { tweet } = req.body;

    const addedTweet = await Tweets.addTweet(userId, tweet);
    res.status(201).json(addedTweet);
  } catch (error) {
    next(error);
  }
});

router.delete("/:tweetId", async (req, res, next) => {
  const tweetId = req.params.tweetId;

  try {
    const toBeDeleted = await Tweets.getByTweetId(tweetId);
    if (toBeDeleted) {
      await Tweets.deleteTweet(tweetId);
      res.json(toBeDeleted);
    } else {
      res.status(404).json({ message: "Tweet not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
