const Tweet = require("../tweets-model");

module.exports = async (req, res, next) => {
  try {
    const tweetId = req.params.tweetId;

    const existingTweet = await Tweet.getByTweetId(tweetId);

    if (!existingTweet) {
      return res.json({ message: "Tweet couldn't found!" });
    } else {
      req.tweeted_id = existingTweet.user_id;
      next();
    }

    // If the like doesn't exist, proceed to the next middleware or route handler
  } catch (error) {
    next(error);
  }
};
