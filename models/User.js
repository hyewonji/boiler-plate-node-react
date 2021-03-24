const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 // salt의 자리수 설정
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlenght:50
    },
    email: {
        type: String,
        trim: true,    // 입력된 email에 공백이 있다면 공백을 없애주는 역할
        unique:1
    },
    password: {
        type: String,
        maxlenght:5
    },
    lastname: {
        type: String,
        maxlenght:50
    },
    role: {
        type: Number,   // 사용자(일반유저, 관리자)를 번호로 구분하는 역할
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

//save 하기 전에 함수를 실행하고 next()가 실행된다.
userSchema.pre('save', function( next ){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash){
                if   (err) return next(err);
                user.password = hash;
                next();
            });
        });
    //비밀번호를 암호화 시킨다.
    } else {
        next();
    };
});

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword : 12345678, 암호화된 비밀번호 : $2b$10$ri3SSGo5gw8A9BoxTX1KyeoeU/CWzxgAOXFobCpPPr4pbCNYeWN6y
    bcrypt.compare(plainPassword,this.password, function(err, isMatch){
        console.log(isMatch);
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb){
    let user = this;
    console.log(user);
    // jsonwebtoken을 이용해서 token 생성하기
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id
    let token =  jwt.sign(user._id.toHexString(), 'secretToken');
    console.log(token);
    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    });
}

const User = mongoose.model('User' ,userSchema);

module.exports = { User };