const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const User = require("../models/User");
const Record = require("../models/Record");
const Log = require("../models/Log");
const key = require("../config/key");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const app = require("../app");

router.use(cookieParser());

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

          const log = new Log({
            user: req.body.user,
            content: `기록 측정 완료`,
          });
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

      const recordData = recordList.reduce(
        (acc, { license }) => {
          if (license === "강주력") acc[0]++;
          else if (license === "주력") acc[1]++;
          else if (license === "1군") acc[2]++;
          else if (license === "2군") acc[3]++;
          else if (license === "3군") acc[4]++;
          else if (license === "4군") acc[5]++;
          else acc[6]++;
          return acc;
        },
        [0, 0, 0, 0, 0, 0, 0]
      );

      const recordSum = recordData.reduce((acc, val) => (acc += val), 0);

      return res.status(200).json({ success: true, recordData, recordSum });
    });
});

/* 모든 유저 군 분포 결과 조회 - 통계 */
router.get("/all/user/license", (req, res) => {
  User.find()
    .select("license")
    .exec((err, licenseList) => {
      if (err) return res.status(400).json({ success: false, err });

      const licenseData = licenseList.reduce(
        (acc, { license }) => {
          if (license === "강주력") acc[0]++;
          else if (license === "주력") acc[1]++;
          else if (license === "1군") acc[2]++;
          else if (license === "2군") acc[3]++;
          else if (license === "3군") acc[4]++;
          else if (license === "4군") acc[5]++;
          else acc[6]++;
          return acc;
        },
        [0, 0, 0, 0, 0, 0, 0]
      );

      return res.status(200).json({ success: true, licenseData });
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
