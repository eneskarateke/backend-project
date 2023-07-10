const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config"); // bu secreti kullanın!
// const User = require("../users/users-model");

module.exports = (req, res, next) => {
  /*
    EKLEYİN

    1- Authorization headerında geçerli token varsa, sıradakini çağırın.

    2- Authorization headerında token yoksa,
      response body şu mesajı içermelidir: "token gereklidir".

    3- Authorization headerında geçersiz veya timeout olmuş token varsa,
	  response body şu mesajı içermelidir: "token geçersizdir".
  */
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
};
