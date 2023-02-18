const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

const Log = require('../models/Log');
const key = require('../config/key');
const auth = require('../middleware/auth');

router.use(cookieParser());

const mongoose = require('mongoose');
const app = require('../app');
mongoose.set('strictQuery', false);
mongoose.connect(key.mongoURI)
  .then(()=> console.log('Log : MongoDB Connected!'))
  .catch(err => console.log(err));


/* 로그 기록 조회 - 관리자 페이지 */
router.get('/manager/all', auth, (req, res) => {
  Log.find().sort({updatedAt: -1}).populate('user', {name:1, image:1}).exec((err, logList) => {
    if(err) return res.status(400).json({success: false, err});
    return res.status(200).json({success: true, logList: logList});
  })
})

module.exports = router;
