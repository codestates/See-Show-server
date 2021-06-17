const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const app = express();

// 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 서버 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//라우팅
app.post('/findpw', indexRouter.findPassword.find); // 비밀번호 메일 보내기
app.post('/changepw', indexRouter.findPassword.change); // 비밀번호 재생성
app.post('/firstcheck', indexRouter.firstCheck); // 장르, 장소 설정

app.post('/login', indexRouter.login.login); // 로그인
app.post('/logout', indexRouter.login.logout); // 로그아웃

app.get('/myPage', indexRouter.myPage.myPage); // 마이페이지
app.post('/myPage', indexRouter.myPage.withdraw); // 회원 탈퇴

app.post('/oauth', indexRouter.oauth); // 오앗

app.get('/recommend/location', indexRouter.recommend.location); //장소 추천
app.get('/recommend/genre', indexRouter.recommend.genre); // 장르 추천

app.get('/refreshTokenRequest', indexRouter.refreshTokenRequest); // 토큰 재발급

app.post('/review/create', indexRouter.review.postCreate); // 리뷰 포스팅
app.post('/review/update', indexRouter.review.postUpdate); // 리뷰 수정
app.get('/review', indexRouter.review.getRead); // 리뷰 리스트 불러오기
app.post('/review', indexRouter.review.postDelete); // 리뷰 삭제

app.get('/show', indexRouter.show.getList); // 공연 리스트 불러오기
app.get('/show/detail', indexRouter.show.detailInfo); // 공연 상세정보
app.post('/show/posting', indexRouter.show.postMyShow); // 내 공연 등록

app.post('/signUp', indexRouter.signUp.nat); // 자체 회원 가입


const today = new Date().toISOString().replace(/-/g, '').replace('T','').replace(/:/g,'').substring(0,8);
let day = '';
if(day !== today){
  day = today;
  indexRouter.show.updateDB();
};

//에러 캐치
app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

let server;
if(fs.existsSync("../key.pem") && fs.existsSync("../cert.pem")){

  const privateKey = fs.readFileSync('..' + "/key.pem", "utf8");
  const certificate = fs.readFileSync('..' + "/cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(HTTPS_PORT, () => console.log("server runnning"));

} else {
  server = app.listen(HTTPS_PORT)
}

module.exports = server;
