module.exports = {
  login: require('./controllers/login'), // 완료
  signUp: require('./controllers/signUp'), // 완료
  refreshTokenRequest: require('./controllers/refreshTokenRequest'), // 완료
  myPage: require('./controllers/myPage'), // 완료
  show: require('./controllers/show'), // 공연 api에서 공연 정보 가져오기, review에 대한 요청 필요
  location: require('./controllers/location'), // 위치 정보 받아 해당 위치로부터 일정 거리 안에 있는 공연 정보 불러오기
  review: require('./controllers/review'), // show 요청 응답 후 요청을 받아 review 요청
  oauth: require('./controllers/OAuth'), // 완료
  firstCheck: require('./controllers/firstCheck') // 완료

  //비밀번호 찾기 구현 -> 데이터베이스에 아이디 찾아서 아이디가 있으면 메일 보내기 없으면 걍 끝 시마이
};