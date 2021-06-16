const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const app = express();
const fs = require('fs');
const https = require('https');

require("dotenv").config();

var router = express.Router();



// 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// 서버 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

//라우팅
app.post('/findpw', indexRouter.findPassword.find); // 비밀번호 메일 보내기
app.post('/changepw', indexRouter.findPassword.change); // 비밀번호 재생성
app.post('/firstcheck', indexRouter.firstCheck); // 장르, 장소 설정

app.post('/login', indexRouter.login.login); // 로그인
app.post('/logout', indexRouter.login.logout); // 로그아웃

app.get('/myPage', indexRouter.myPage.myPage); // 마이페이지
app.post('/myPage', indexRouter.myPage.withdraw); // 회원 탈퇴

app.post('/oauth', indexRouter.oauth); // 오앗!!!

app.get('/recommend/location', indexRouter.recommend.location); //장소 추천
app.get('/recommend/genre', indexRouter.recommend.genre); // 장르 추천

app.get('/refreshTokenRequest', indexRouter.refreshTokenRequest); // 토큰 재발급

app.post('/review/create', indexRouter.review.postCreate); // 리뷰 포스팅
app.post('/review/update', indexRouter.review.postUpdate); // 리뷰 수정
app.get('/review', indexRouter.review.getRead); // 리뷰 리스트 불러오기
app.post('/review', indexRouter.review.postDelete); // 리뷰 삭제

app.get('/show', indexRouter.show.getList); // 공연 리스트 불러오기
app.post('/show/detail', indexRouter.show.detailInfo); // 공연 상세정보
app.post('/show/posting', indexRouter.show.postMyShow); // 내 공연 등록

app.post('/signUp', indexRouter.signUp.nat); // 자체 회원 가입

// const today = new Date().toISOString().replace(/-/g, '').replace('T','').replace(/:/g,'').substring(0,8);
// let day = '';
// if(day !== today){
//   day = today;
//   indexRouter.show.updateDB();
// };

const HTTPS_PORT = process.env.HTTPS_PORT || 8080;

// 인증서 파일들이 존재하는 경우에만 https 프로토콜을 사용하는 서버를 실행합니다. 
// 만약 인증서 파일이 존재하지 않는경우, http 프로토콜을 사용하는 서버를 실행합니다.
// 파일 존재여부를 확인하는 폴더는 서버 폴더의 package.json이 위치한 곳입니다.
let server;
if(fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")){

  const privateKey = fs.readFileSync('.' + "/key.pem", "utf8");
  const certificate = fs.readFileSync('.' + "/cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(HTTPS_PORT, () => console.log("server runnning"));

} else {
  server = app.listen(HTTPS_PORT)
}

module.exports = server;