const User = require("../models/User");

const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (token === undefined)
    return res.status(200).json({ isAuth: false, message: "no Token" });

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.status(401).json({ isAuth: false, message: "인증 실패" });

    User.updateOne({ _id: user._id }, { $inc: { authCount: 1 } }).then(() => {
      req.token = token;
      req.user = user;
      next();
    });
  });
};

module.exports = auth;
