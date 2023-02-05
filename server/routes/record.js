const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

const User = require('../models/User');
const Record = require('../models/Record');
const key = require('../config/key');
// const auth = require('../middleware/auth');

router.use(cookieParser());

const mongoose = require('mongoose');
const app = require('../app');
mongoose.connect(key.mongoURI)
  .then(()=> console.log('MongoDB Connected!'))
  .catch(err => console.log(err));


/* 기록 저장 */
router.post('/save', (req, res) => {
  const record = new Record(req.body);
  
  record.save((err, recordInfo) => {
    if(err) return res.status(400).json({success: false, err});

    if(req.body.user) {
      User.findOneAndUpdate({_id: req.body.user}, {license: recordInfo.license}, err => {
        if(err) return res.status(400).json({success: false, err});
        return res.status(200).json({success: true, id: recordInfo._id});
      })
    }
    else return res.status(200).json({success: true, id: recordInfo._id});
  })
})

/* 결과 페이지 데이터 조회 */
router.get('/:id', (req, res) => {
  Record.findOne({_id: req.params.id}).populate('user').exec((err, record) => {
    if(err) return res.status(400).json({success: false, err});
    return res.status(200).json({success: true, record: record});
  })
})

/* 유저 기록 조회 */
router.get('/userRecord/:userId', (req, res) => {
  Record.find({user: req.params.userId}).select('season recordCount license createdAt').exec((err, recordList) => {
    if(err) return res.status(400).json({success: false, err});
    return res.status(200).json({success: true, recordList: recordList});
  })
})

module.exports = router;
