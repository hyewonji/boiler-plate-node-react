const mongoose = require('mongoose')

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

const User = mongoose.model('User,userSchema')

module.exports = {User}