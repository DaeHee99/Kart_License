const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const Survey = require("../models/Survey");
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
  .then(() => console.log("Survey : MongoDB Connected!"))
  .catch((err) => console.log(err));

/* 피드백 저장 */
router.post("/save", (req, res) => {
  const survey = new Survey(req.body);

  survey.save((err) => {
    if (err) return res.status(400).json({ success: false, err });

    User.findOneAndUpdate(
      { _id: req.body.user },
      { recentSurvey: req.body.season },
      (err, user) => {
        if (err) return res.status(400).json({ success: false, err });

        const log = new Log({
          user: req.body.user,
          content: `군표 피드백 작성 완료`,
        });
        log.save();

        return res.status(200).json({ success: true });
      }
    );
  });
});

/* 모든 피드백 조회 - 관리자 페이지 */
router.get("/manager/all", auth, (req, res) => {
  Survey.find()
    .sort({ createdAt: -1 })
    .populate("user", { name: 1, image: 1 })
    .exec((err, surveyList) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, surveyList: surveyList });
    });
});

/* 실시간 후기 조회 - 관리자 페이지 (pagination) */
router.get("/manager/:page", auth, (req, res) => {
  Survey.find()
    .sort({ createdAt: -1 })
    .populate("user", { name: 1, image: 1 })
    .limit(20)
    .skip(20 * (req.params.page - 1))
    .exec((err, surveyList) => {
      if (err) return res.status(400).json({ success: false, err });
      Survey.find()
        .count()
        .exec((err, result) => {
          if (err) return res.status(400).json({ success: false, err });
          return res
            .status(200)
            .json({ success: true, count: result, surveyList: surveyList });
        });
    });
});

module.exports = router;
