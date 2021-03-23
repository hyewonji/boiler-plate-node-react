/*const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10 

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
})

userSchema.pre('save', function( next ){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    //비밀번호를 암호화 시킨다.
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cd){
    //plainPassword : 1234567, 암호화된 비밀번호 : 
    bcrypt.compare(plainPassword,this.password, function(err, isMatch){
        if(err) return cb(err),
            cb(null, isMatch)
    })
}

const User = mongoose.model('User' ,userSchema)

module.exports = { User }*/