const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const { User } = require("./models/User");

// application/x-www-form-urlencoded
// bodyParser.urlencoded() -> 자동으로 req에 body속성이 추가되고 저장
// extended: true -> 중첩된 객체 표현여부 결정(객체안에 객체 파싱 가능하게 한다.)
app.use(bodyParser.urlencoded({extended:true}));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hye1:086975864@boiler-plate-node-react.6h4is.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) =>  res.send('Hello World!'))

app.post('/register', (req,res) => {

  const user = new User(req.body) //bodyParser로 body에 있는 회원정보를 가져옴
  
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost: ${port}`)
}) 