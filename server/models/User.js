const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 16,
        trim: true,
        unique: true
    },
    id: {
        type: String,
        minlength: 6
    },
    password: {
        type: String,
        minlength: 6
    },
    plainPassword: {
        type: String,
        minlength: 6
    },
    image: {
        type: String
    },
    license: {
        type: String,
        default: ''
    },
    role: {
        type: Number,
        default: 0
    },
    token: String,
    tokenExp: Number
}, { timestamps: true });

userSchema.pre('save', function (next) {
    let user = this;

    if(user.isModified('password')) {
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err) return next(err);
            
            bcrypt.hash(user.password, salt, function (err, result) {
                if(err) return next(err);
                
                user.password = result;
                next();
            })
        })
    }
    else next();
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, result) {
        if(err) return cb(err);
        cb(null, result);
    })
}

userSchema.methods.generateToken = function(cb) {
    let user = this;

    let token = jwt.sign(user._id.toHexString(), 'kartChuClub');

    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    let user = this;

    jwt.verify(token, 'kartChuClub', function(err, decoded) {
        if(err) return cb(err);
        
        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = User;