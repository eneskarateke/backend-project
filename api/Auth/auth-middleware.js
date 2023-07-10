const jwt = require("jsonwebtoken");
const { JWT_SECRET, HASH_ROUND } = require("../../config");
const bcrypt = require("bcryptjs");

const User = require("../Users/users-model");

const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "Token gereklidir" });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Token gecersizdir" });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  }
  /*
    Eğer Authorization header'ında bir token sağlanmamışsa:
    status: 401
    {
      "message": "Token gereklidir"
    }

    Eğer token doğrulanamıyorsa:
    status: 401
    {
      "message": "Token gecersizdir"
    }

    Alt akıştaki middlewarelar için hayatı kolaylaştırmak için kodu çözülmüş tokeni req nesnesine koyun!
  */
};

const usernameLogin = async (req, res, next) => {
  /*
    req.body de verilen username veritabanında yoksa
    status: 401
    {
      "message": "Geçersiz kriter"
    }
  */
  const { username } = req.body;
  const [user] = await User.getByFilter({ username: username });
  if (!user) {
    res.status(401).json({ message: "Geçersiz kriter" });
  } else {
    req.user = user;
    next();
  }
};

const usernameRegister = async (req, res, next) => {
  /*
      req.body de verilen username veritabanında yoksa
      status: 401
      {
        "message": "Geçersiz kriter"
      }
    */
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
module.exports = {
  restricted,
  usernameLogin,
  usernameRegister,
};
