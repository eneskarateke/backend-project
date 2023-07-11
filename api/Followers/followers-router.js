const router = require("express").Router();
const Followers = require("./followers-model");
const payloadCheck = require("../middleware/followerPayload");
const userCheck = require("../middleware/followedExist");

// Create a follower
router.post("/", payloadCheck, async (req, res) => {
  const { id_user, id_follower } = req.body;

  try {
    const result = await Followers.createFollower(id_user, id_follower);

    if (result) {
      return res
        .status(200)
        .json({ message: "Follower created successfully." });
    } else {
      return res.status(500).json({ error: "Failed to create follower." });
    }
  } catch (error) {
    console.error("Error creating follower:", error);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// Delete a follower
router.delete("/", payloadCheck, async (req, res, next) => {
  const { id_user, id_follower } = req.body;

  try {
    const result = await Followers.deleteFollower(id_user, id_follower);

    if (result) {
      return res
        .status(200)
        .json({ message: "Follower deleted successfully." });
    } else {
      return res.status(500).json({ error: "Failed to delete follower." });
    }
  } catch (error) {
    next(error);
  }
});

// Get followers for a user
router.get("/:userId", userCheck, async (req, res) => {
  const userId = req.params.userId;

  try {
    const followers = await Followers.getFollowers(userId);
    return res.status(200).json({ followers });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
