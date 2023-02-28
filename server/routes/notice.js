const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

const Notice = require('../models/Notice');
const key = require('../config/key');
const auth = require('../middleware/auth');

router.use(cookieParser());

const mongoose = require('mongoose');
const app = require('../app');
mongoose.set('strictQuery', false);
mongoose.connect(key.mongoURI)
  .then(()=> console.log('Notice : MongoDB Connected!'))
  .catch(err => console.log(err));


/* 공지 조회 - 전체 */
router.get('/', (req, res) => {
  Notice.find({show: true}).exec((err, result) => {
    if(err) return res.status(400).json({success: false, err});
    return res.status(200).json({success: true, data: result});
  })
})

/* 공지 등록 - 관리자 */
router.post('/save', auth, (req, res) => {
  if(!req.user.role) return res.status(200).json({success: false, message: '관리자가 아닙니다.'});
  Notice.findOneAndUpdate({show: true}, {show: false}, (err) => {
    if(err) return res.status(400).json({success: false, err});
    let notice = new Notice(req.body);
    notice.save();

    return res.status(200).json({success: true});
  })
})

/* 공지 삭제 - 관리자 */
router.delete('/', auth, (req, res) => {
  if(!req.user.role) return res.status(200).json({success: false, message: '관리자가 아닙니다.'});
  Notice.findOneAndUpdate({show: true}, {show: false}, (err) => {
    if(err) return res.status(400).json({success: false, err});
    return res.status(200).json({success: true});
  })
})

module.exports = router;
