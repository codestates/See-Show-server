module.exports = {
  login: require('./controllers/login'), // OAuth, 토큰
  signUp: require('./controllers/signUp'), // 회원가입
  refreshTokenRequest: require('./controllers/refreshTokenRequest'), // 토큰 재발급
  myPage: require('./controllers/myPage'), // 회원정보 불러오기
  show: require('./controllers/show'), // 공연 api에서 공연 정보 가져오기, review에 대한 요청 필요
  location: require('./controllers/location'), // 위치 정보 받아 해당 위치로부터 일정 거리 안에 있는 공연 정보 불러오기
  reviewGet: require('./controllers/reviewGet'), // show 요청 응답 후 요청을 받아 review 요청
  reviewPost: require('./controllers/reviewPost'), // show 요청 응답 후 요청을 받아 review 요청
  oauth: require('./controllers/OAuth');
};