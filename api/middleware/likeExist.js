const db = require("../../data/dbConfig");

module.exports = async (req, res, next) => {
  try {
    const tweetId = req.params.tweetId;
    const likedId = req.body.liked_id;

    const existingLike = await db("likes")
      .select("*")
      .where("tweet_id", "=", tweetId)
      .andWhere("liked_id", "=", likedId);

    if (existingLike.length > 0) {
      return res
        .status(409)
        .json({ message: "You have already liked this tweet" });
    }

    // If the like doesn't exist, proceed to the next middleware or route handler
    next();
  } catch (error) {
    next(error);
  }
};
