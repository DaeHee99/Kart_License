const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 16,
      trim: true,
      unique: true,
    },
    id: {
      type: String,
      minlength: 2,
      unique: true,
    },
    password: {
      type: String,
      minlength: 4,
    },
    plainPassword: {
      type: String,
      minlength: 4,
    },
    image: {
      type: String,
    },
    license: {
      type: String,
      default: "",
    },
    role: {
      type: Number,
      default: 0,
    },
    token: String,
    tokenExp: Number,
    authCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", (next) => {
  const user = this;

  if (user.isModified("password")) {
    //비밀번호 암호화
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, result) => {
        if (err) return next(err);

        user.password = result;
        next();
      });
    });
  } else next();
});

userSchema.methods.comparePassword = (plainPassword, cb) => {
  bcrypt.compare(plainPassword, this.password, (err, result) => {
    if (err) return cb(err);
    cb(null, result);
  });
};

userSchema.methods.generateToken = (cb) => {
  const user = this;

  const token = jwt.sign(user._id.toHexString(), "kartChuClub");

  user.token = token;
  user.save((err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = (token, cb) => {
  const user = this;

  jwt.verify(token, "kartChuClub", (err, decoded) => {
    if (err) return cb(err);

    user.findOne({ _id: decoded, token: token }, (err, user) => {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

userSchema.methods.changePassword = (newPassword, cb) => {
  const user = this;

  user.password = newPassword;
  user.plainPassword = newPassword;
  user.save((err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
