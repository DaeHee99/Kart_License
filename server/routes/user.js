const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const User = require("../models/User");
const Log = require("../models/Log");
const key = require("../config/key");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const app = require("../app");

router.use(cookieParser());

mongoose.set("strictQuery", false);
mongoose
  .connect(key.mongoURI)
  .then(() => console.log("User : MongoDB Connected!"))
  .catch((err) => console.log(err));

/* 회원가입 */
router.post("/register", (req, res) => {
  User.findOne({ name: req.body.name }, (err, userInfo) => {
    if (err) return res.status(400).json({ success: false, err });

    if (userInfo) {
      return res.status(200).json({
        success: false,
        message: "이미 존재하는 닉네임입니다.",
      });
    }

    User.findOne({ id: req.body.id }, (err, userInfo) => {
      if (err) return res.status(400).json({ success: false, err });

      if (userInfo) {
        return res.status(200).json({
          success: false,
          message: "이미 존재하는 아이디입니다.",
        });
      }

      const user = new User(req.body);

      user.save((err, userInfo) => {
        if (err) return res.status(400).json({ success: false, err });

        const log = new Log({ user: userInfo._id, content: "회원가입 완료" });
        log.save();

        return res.status(200).json({ success: true });
      });
    });
  });
});

/* 로그인 */
router.post("/login", (req, res) => {
  User.findOne({ id: req.body.id }, (err, userInfo) => {
    if (err) return res.status(400).json({ success: false, err });

    if (!userInfo) {
      return res.status(200).json({
        success: false,
        message: "존재하지 않는 아이디 입니다.",
      });
    }

    userInfo.comparePassword(req.body.password, (err, result) => {
      if (err) return res.status(400).json({ success: false, err });

      if (!result)
        return res.status(200).json({
          success: false,
          message: "비밀번호가 틀렸습니다.",
        });

      userInfo.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // Cookie Expires => 2 hour
        res
          .cookie("token", user.token, { maxAge: 60 * 60 * 1000 * 2 })
          .status(200)
          .json({ success: true, userId: user._id, name: user.name });
      });
    });
  });
});

/* 인증 */
router.get("/auth", auth, (req, res) => {
  // auth 미들웨어 통과 => authentication True, 인증 통과
  res.status(200).json({
    _id: req.user._id,
    isAuth: true,
    name: req.user.name,
    image: req.user.image,
    license: req.user.license,
    role: req.user.role,
    isAdmin: req.user.role === 0 ? false : true,
  });
});

/* 로그아웃 */
router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.clearCookie("token").status(200).json({ success: true });
  });
});

/* 닉네임 변경 */
router.post("/changeName", auth, (req, res) => {
  User.findOne({ name: req.body.newName }, (err, userInfo) => {
    if (err) return res.status(400).json({ success: false, err });

    if (userInfo) {
      return res.status(200).json({
        success: false,
        message: "이미 존재하는 닉네임입니다.",
      });
    } else {
      const oldName = req.user.name;
      User.findOneAndUpdate(
        { _id: req.user._id },
        { name: req.body.newName },
        (err, user) => {
          if (err) return res.status(400).json({ success: false, err });

          const log = new Log({
            user: req.user._id,
            content: `닉네임 변경 (${oldName} -> ${req.body.newName})`,
          });
          log.save();

          return res.status(200).json({ success: true });
        }
      );
    }
  });
});

/* 비밀번호 변경 */
router.post("/changePassword", auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    if (err || !userInfo) return res.status(400).json({ success: false, err });

    userInfo.changePassword(req.body.newPassword, (err, result) => {
      if (err || !result) return res.status(400).json({ success: false, err });

      const log = new Log({ user: req.user._id, content: `비밀번호 변경` });
      log.save();

      return res.status(200).json({ success: true });
    });
  });
});

/* 프로필 사진 변경 */
router.post("/changeImage", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { image: req.body.newImage },
    (err) => {
      if (err) return res.status(400).json({ success: false, err });

      const log = new Log({ user: req.user._id, content: `프로필 사진 변경` });
      log.save();

      return res.status(200).json({ success: true });
    }
  );
});

/* 모든 유저 조회 - 관리자 페이지 */
router.get("/manager/all", auth, (req, res) => {
  User.find()
    .sort({ updatedAt: -1 })
    .select("name image license updatedAt")
    .exec((err, userList) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, userList: userList });
    });
});

/* 실시간 유저 조회 - 관리자 페이지 (pagination) */
router.get("/manager/:page", auth, (req, res) => {
  User.find()
    .sort({ updatedAt: -1 })
    .select("name image license updatedAt")
    .limit(20)
    .skip(20 * (req.params.page - 1))
    .exec((err, userList) => {
      if (err) return res.status(400).json({ success: false, err });
      User.find()
        .count()
        .exec((err, result) => {
          if (err) return res.status(400).json({ success: false, err });
          return res
            .status(200)
            .json({ success: true, count: result, userList: userList });
        });
    });
});

/* 실시간 유저 조회 - 관리자 페이지 (검색) */
router.get("/manager/find/:name", auth, (req, res) => {
  User.find({ name: { $regex: req.params.name } })
    .sort({ updatedAt: -1 })
    .select("name image license updatedAt")
    .exec((err, userList) => {
      if (err) return res.status(400).json({ success: false, err });
      return res
        .status(200)
        .json({ success: true, count: userList.length, userList: userList });
    });
});

/* 유저 페이지 */
router.get("/userData/:id", (req, res) => {
  User.findOne({ _id: req.params.id }, (err, userInfo) => {
    if (err || !userInfo) return res.status(400).json({ success: false, err });

    res.status(200).json({
      success: true,
      _id: userInfo._id,
      name: userInfo.name,
      image: userInfo.image,
      license: userInfo.license,
      isAdmin: userInfo.role === 0 ? false : true,
    });
  });
});

module.exports = router;
