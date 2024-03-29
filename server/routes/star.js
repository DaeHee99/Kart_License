const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const Star = require("../models/Star");
const Log = require("../models/Log");
const key = require("../config/key");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const app = require("../app");

router.use(cookieParser());

mongoose.set("strictQuery", false);
mongoose
  .connect(key.mongoURI)
  .then(() => console.log("Star : MongoDB Connected!"))
  .catch((err) => console.log(err));

/* 후기 저장 */
router.post("/save", (req, res) => {
  const star = new Star(req.body);

  star.save((err) => {
    if (err) return res.status(400).json({ success: false, err });

    if (req.body.user) {
      const log = new Log({ user: req.body.user, content: `후기 작성 완료` });
      log.save();
    }

    res.status(200).json({ success: true });
  });
});

/* 모든 후기 조회 - 관리자 페이지 */
router.get("/manager/all", auth, (req, res) => {
  Star.find()
    .sort({ createdAt: -1 })
    .populate("user", { name: 1, image: 1 })
    .exec((err, starList) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, starList: starList });
    });
});

/* 실시간 후기 조회 - 관리자 페이지 (pagination) */
router.get("/manager/:page", auth, (req, res) => {
  Star.find()
    .sort({ createdAt: -1 })
    .populate("user", { name: 1, image: 1 })
    .limit(20)
    .skip(20 * (req.params.page - 1))
    .exec((err, starList) => {
      if (err) return res.status(400).json({ success: false, err });
      Star.find()
        .count()
        .exec((err, result) => {
          if (err) return res.status(400).json({ success: false, err });
          return res
            .status(200)
            .json({ success: true, count: result, starList: starList });
        });
    });
});

module.exports = router;
