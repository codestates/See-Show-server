module.exports = {
  login: require('./controllers/login'), // 완료
  signUp: require('./controllers/signUp'), // 완료
  refreshTokenRequest: require('./controllers/refreshTokenRequest'), // 완료
  myPage: require('./controllers/myPage'), // 완료
  show: require('./controllers/show'), // 완료
  recommend: require('./controllers/recommend'), // 완료
  review: require('./controllers/review'), // show 요청 응답 후 요청을 받아 review 요청
  oauth: require('./controllers/OAuth'), // 완료
  firstCheck: require('./controllers/firstCheck'), // 완료
  findPassword: require('./controllers/findPassword') // 완료
};