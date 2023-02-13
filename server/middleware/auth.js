const User = require('../models/User');

let auth = (req, res, next) => {
  let token = req.cookies.token;

  if(token === undefined) {
    return res.status(200).json({isAuth: false, message: "no Token"});
  }
  else {
    User.findByToken(token, (err, user) => {
      if(err) throw err;
      if(!user) return res.status(400).json({isAuth: false, message: "인증 실패"});

      user.update({updatedAt: new Date()}).then(result => {
        req.token = token;
        req.user = user;
        next();
      });
    })
  }
}

module.exports = auth;