const router = require("express").Router();
const Users = require("./users-model.js");

router.get("/", async (req, res, next) => {
  try {
    const users = await Users.findAll();
    if (users) {
      res.json(users);
    } else {
      res.status(404).json({ message: "Users not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await Users.getById(req.params.id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
