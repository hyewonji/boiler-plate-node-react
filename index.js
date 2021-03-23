const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const config = require("./config/key");
const { User } = require("./models/User");

/* application/x-www-form-urlencoded 와같은 데이터를 분석해서 가져올 수 있게 한다.*/
// bodyParser.urlencoded() -> 자동으로 req에 body속성이 추가되고 저장
// extended: true -> 중첩된 객체 표현여부 결정(객체안에 객체 파싱 가능하게 한다.)
app.use(bodyParser.urlencoded({extended:true}));

/* application/json json으로 된 데이터를 분석해서 가져올 수 있게 한다.*/
app.use(bodyParser.json());

/* mongoose 연결 */
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    // Error 방지하기 위한 코드
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) =>  res.send('Hello World! hi'))

app.post('/register', (req,res) => {
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것을 DB에 넣어준다.

  const user = new User(req.body) //bodyParser로 body에 있는 회원정보를 가져옴
  
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})


app.listen(port, ( ) => {
  console.log(`Example app listening at http://localhost: ${port}`)
}) 

