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

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const tweets = await Tweets.getByUserId(userId);
    res.json(tweets);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
