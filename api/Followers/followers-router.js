const router = require("express").Router();
const Followers = require("./followers-model");
const payloadCheck = require("./FollowerMiddlewares/followerPayload");
const userCheck = require("./FollowerMiddlewares/followedExist");
const alreadyFollower = require("./FollowerMiddlewares/alreadyFollower");
const cannotFollowSelf = require("./FollowerMiddlewares/cannotFollowSelf");
const isThereAnyFollow = require("./FollowerMiddlewares/isThereAnyFollow");
// Create a follower
router.post(
  "/:id",
  payloadCheck,
  cannotFollowSelf,
  alreadyFollower,
  async (req, res, next) => {
    const { id_follower } = req.body;
    const id_user = req.params.id;

    try {
      const result = await Followers.createFollower(id_user, id_follower);

      if (result) {
        // Fetch the user and follower information
        const [user, follower] = await Promise.all([
          Followers.getUserById(id_user),
          Followers.getUserById(id_follower),
        ]);

        res.status(200).json({
          message: "Follower created successfully.",
          user: { user_id: user.user_id, username: user.username },
          follower: { user_id: follower.user_id, username: follower.username },
        });
      } else {
        throw new Error("Failed to create follower.");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Delete a follower
router.delete(
  "/:id",
  payloadCheck,
  isThereAnyFollow,
  async (req, res, next) => {
    const { id_follower } = req.body;
    const id_user = req.params.id;

    try {
      const result = await Followers.deleteFollower(id_user, id_follower);

      if (result) {
        res.status(200).json({ message: "Follower deleted successfully." });
      } else {
        throw new Error("Failed to delete follower.");
      }
    } catch (error) {
      next(error);
    }
  }
);

// Get followers for a user
router.get("/:userId", userCheck, async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const followers = await Followers.getFollowers(userId);
    res.status(200).json({ followers });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
