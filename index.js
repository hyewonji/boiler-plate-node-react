const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

/* application/x-www-form-urlencoded 와같은 데이터를 분석해서 가져올 수 있게 한다.*/
// bodyParser.urlencoded() -> 자동으로 req에 body속성이 추가되고 저장
// extended: true -> 중첩된 객체 표현여부 결정(객체안에 객체 파싱 가능하게 한다.)
app.use(bodyParser.urlencoded({extended:true}));

/* application/json json으로 된 데이터를 분석해서 가져올 수 있게 한다.*/
app.use(bodyParser.json());
app.use(cookieParser());

/* mongoose 연결 */
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    // Error 방지하기 위한 코드
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) =>  res.send('Hello World! hi'))

app.post('/api/users/register', (req,res) => {
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면
  // save 하기 전에 정보들을 DB에 넣어준다.

  const user = new User(req.body) //bodyParser로 body에 있는 회원정보를 가져옴
  
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req,res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err,user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
   
    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 일치하는지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});

      // 비밀번호가 일치한다면 토큰을 생성하기
      user.generateToken((err, user) => {
          if(err) return res.status(400).send(err);
          // 토큰을 저장한다.(쿠키, LS ...)
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get('api/users/auth', auth, (req,res)=>{
  // 여기까지 미들웨어를 통과해 왔다면 Authentication이 True라는 의미.
  res.status(200)
  .json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, // 0이면 일반유저, 이외의 숫자는 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.listen(port, ( ) => {
  console.log(`Example app listening at http://localhost: ${port}`);
});

