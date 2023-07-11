const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, HASH_ROUND } = require("../../config"); // bu secret'ı kullanın!
const User = require("../Users/users-model");
const usernameLogin = require("../middleware/usernameLogin");
const usernameRegister = require("../middleware/usernameRegister");
const payloadCheck = require("../middleware/payloadCheck");

router.post(
  "/register",
  payloadCheck,
  usernameRegister,
  async (req, res, next) => {
    const { username } = req.body;

    try {
      const user = await User.addUser({
        username: username,
        password: req.hashedPassword,
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/login", payloadCheck, usernameLogin, (req, res, next) => {
  const { password } = req.body;

  if (req.user && bcrypt.compareSync(password, req.user.password)) {
    const payload = {
      id: req.user.user_id,
      username: req.user.username,
      // password: req.user.password,
    };
    const options = {
      expiresIn: "24h",
    };

    const token = jwt.sign(payload, JWT_SECRET, options);
    res.json({ message: `welcome ${req.user.username}`, token: token });
  } else {
    next(error);
  }
});

module.exports = router;
