const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const app = express();
const fs = require('fs');

var router = express.Router();

// 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 서버 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//라우팅
router.post('/findpw', indexRouter.findPassword.find); // 비밀번호 메일 보내기
router.post('/changepw', indexRouter.findPassword.change); // 비밀번호 재생성
router.post('/firstcheck', indexRouter.firstCheck); // 장르, 장소 설정

router.post('/login', indexRouter.login.login); // 로그인
router.post('/logout', indexRouter.login.logout); // 로그아웃

router.get('/myPage', indexRouter.myPage.myPage); // 마이페이지
router.post('/myPage', indexRouter.myPage.withdraw); // 회원 탈퇴

router.post('/oauth', indexRouter.oauth); // 오앗!!!

router.get('/recommend/location', indexRouter.recommend.location); //장소 추천
router.get('/recommend/genre', indexRouter.recommend.genre); // 장르 추천

router.get('/refreshTokenRequest', indexRouter.refreshTokenRequest); // 토큰 재발급

router.post('/review/create', indexRouter.review.postCreate); // 리뷰 포스팅
router.post('/review/update', indexRouter.review.postUpdate); // 리뷰 수정
router.get('/review', indexRouter.review.getRead); // 리뷰 리스트 불러오기
router.post('/review', indexRouter.review.postDelete); // 리뷰 삭제

router.get('/show', indexRouter.show.getList); // 공연 리스트 불러오기
router.get('/show/detail', indexRouter.show.detailInfo); // 공연 상세정보
router.post('/show/posting', indexRouter.show.postMyShow); // 내 공연 등록

router.post('/signUp', indexRouter.signUp.nat); // 자체 회원 가입

const today = new Date().toISOString().replace(/-/g, '').replace('T','').replace(/:/g,'').substring(0,8);
let day = '';
if(day !== today){
  day = today;
  indexRouter.show.updateDB();
};

module.exports = app;