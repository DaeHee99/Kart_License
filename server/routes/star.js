const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

const Star = require('../models/Star');
const Log = require('../models/Log');
const key = require('../config/key');

router.use(cookieParser());

const mongoose = require('mongoose');
const app = require('../app');
mongoose.connect(key.mongoURI)
  .then(()=> console.log('MongoDB Connected!'))
  .catch(err => console.log(err));


/* 후기 저장 */
router.post('/save', (req, res) => {
  const star = new Star(req.body);
  
  star.save(err => {
    if(err) return res.status(400).json({success: false, err});

    if(req.body.user) {
      let log = new Log({user: req.body.user, content: `후기 작성 완료`});
      log.save();
    }

    res.status(200).json({success: true});
  })
})

module.exports = router;
