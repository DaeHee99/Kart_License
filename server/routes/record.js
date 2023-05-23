const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const User = require("../models/User");
const Record = require("../models/Record");
const Log = require("../models/Log");
const key = require("../config/key");
const auth = require("../middleware/auth");

router.use(cookieParser());

const mongoose = require("mongoose");
const app = require("../app");
mongoose.set("strictQuery", false);
mongoose
  .connect(key.mongoURI)
  .then(() => console.log("Record : MongoDB Connected!"))
  .catch((err) => console.log(err));

/* 기록 저장 */
router.post("/save", (req, res) => {
  const record = new Record(req.body);

  record.save((err, recordInfo) => {
    if (err) return res.status(400).json({ success: false, err });

    if (req.body.user) {
      User.findOneAndUpdate(
        { _id: req.body.user },
        { license: recordInfo.license },
        (err) => {
          if (err) return res.status(400).json({ success: false, err });

          let log = new Log({ user: req.body.user, content: `기록 측정 완료` });
          log.save();

          return res.status(200).json({ success: true, id: recordInfo._id });
        }
      );
    } else return res.status(200).json({ success: true, id: recordInfo._id });
  });
});

/* 모든 기록 조회 - 통계 */
router.get("/all", (req, res) => {
  Record.find()
    .select("license")
    .exec((err, recordList) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, recordList: recordList });
    });
});

/* 실시간 모든 기록 조회 - 관리자 페이지 */
router.get("/manager/all", auth, (req, res) => {
  Record.find()
    .sort({ createdAt: -1 })
    .select("license recordCount")
    .populate("user", { name: 1, image: 1 })
    .exec((err, recordList) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, recordList: recordList });
    });
});

/* 실시간 기록 조회 - 관리자 페이지 (pagination) */
router.get("/manager/:page", auth, (req, res) => {
  Record.find()
    .sort({ createdAt: -1 })
    .select("license recordCount")
    .populate("user", { name: 1, image: 1 })
    .limit(20)
    .skip(20 * (req.params.page - 1))
    .exec((err, recordList) => {
      if (err) return res.status(400).json({ success: false, err });
      Record.find()
        .count()
        .exec((err, result) => {
          if (err) return res.status(400).json({ success: false, err });
          return res
            .status(200)
            .json({ success: true, count: result, recordList: recordList });
        });
    });
});

/* 결과 페이지 데이터 조회 */
router.get("/:id", (req, res) => {
  Record.findOne({ _id: req.params.id, season: { $gt: 0 } })
    .populate("user")
    .exec((err, record) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, record: record });
    });
});

/* 유저 기록 조회 */
router.get("/userRecord/:userId", (req, res) => {
  Record.find({ user: req.params.userId, season: { $gt: 0 } })
    .select("season recordCount license createdAt")
    .exec((err, recordList) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, recordList: recordList });
    });
});

/* 유저 최근 기록 조회 */
router.post("/latestRecord", (req, res) => {
  if (req.body.userId === "")
    return res.status(200).json({ success: false, message: "no Login" });

  Record.findOne({ user: req.body.userId, season: { $gt: 0 } })
    .sort({ createdAt: -1 })
    .limit(1)
    .select("record")
    .exec((err, record) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, record });
    });
});

module.exports = router;
