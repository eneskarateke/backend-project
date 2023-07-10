const User = require("../Users/users-model");
const bcrypt = require("bcryptjs");
const { HASH_ROUND } = require("../../config");

module.exports = async (req, res, next) => {
  const { username, password } = req.body;
  const [user] = await User.getByFilter({ username: username });
  if (user) {
    res.status(422).json({ message: "User zaten tanımlı" });
  } else {
    const hashedPassword = bcrypt.hashSync(password, HASH_ROUND);
    req.hashedPassword = hashedPassword;
    next();
  }
};
