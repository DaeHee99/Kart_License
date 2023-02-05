const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

const User = require('../models/User');
const key = require('../config/key');
const auth = require('../middleware/auth');

router.use(cookieParser());

const mongoose = require('mongoose');
const app = require('../app');
mongoose.connect(key.mongoURI)
  .then(()=> console.log('MongoDB Connected!'))
  .catch(err => console.log(err));


/* 회원가입 */
router.post('/register', (req, res) => {
  User.findOne({name: req.body.name}, (err, userInfo) => {
    if(err) return res.status(400).json({success: false, err});

    if(userInfo) {
      return res.status(200).json({
        success: false,
        message: "이미 존재하는 닉네임입니다."
      })
    }

    User.findOne({id: req.body.id}, (err, userInfo) => {
      if(err) return res.status(400).json({success: false, err});
  
      if(userInfo) {
        return res.status(200).json({
          success: false,
          message: "이미 존재하는 아이디입니다."
        })
      }

      const user = new User(req.body);

      user.save((err, userInfo) => {
        if(err) return res.status(400).json({success: false, err});
        return res.status(200).json({success: true});
      })
    })
  })
})

/* 로그인 */
router.post('/login', (req, res) => {
  User.findOne({id: req.body.id}, (err, userInfo) => {
    if(err) return res.status(400).json({success: false, err});

    if(!userInfo) {
      return res.status(200).json({
        success: false,
        message: "존재하지 않는 아이디 입니다."
      })
    }

    userInfo.comparePassword(req.body.password, (err, result) => {
      if(err) return res.status(400).json({success: false, err});

      if(!result) return res.status(200).json({
        success: false,
        message: "비밀번호가 틀렸습니다."
      })

      userInfo.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // Cookie Expires => 2 hour
        res.cookie("token", user.token, {maxAge : 60*60*1000*2}).status(200).json({success: true, userId: user._id, name: user.name});
      })
    })
  })
})

/* 인증 */
router.get('/auth', auth, (req, res) => {
  // auth 미들웨어 통과 => authentication True, 인증 통과
  res.status(200).json({
    _id: req.user._id,
    isAuth: true,
    name: req.user.name,
    image: req.user.image,
    license: req.user.license,
    role: req.user.role,
    isAdmin: req.user.role === 0 ? false : true
  })
})

/* 로그아웃 */
router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
    if(err) return res.status(400).json({success: false, err});
    return res.clearCookie("token").status(200).json({success: true});
  })
})

module.exports = router;
