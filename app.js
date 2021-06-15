const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const app = express();
const fs = require('fs');

// 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 서버 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//라우팅
app.post('/login', indexRouter.login.login);
app.post('/logout', indexRouter.login.logout);
app.post('/oauth', indexRouter.oauth);

app.post('/signUp', indexRouter.signUp.nat);

app.get('/refreshTokenRequest', indexRouter.refreshTokenRequest);

app.get('/myPage', indexRouter.myPage.myPage);
app.post('/myPage', indexRouter.myPage.withdraw);

app.get('/show', indexRouter.show.getList);
app.get('/show/detail', indexRouter.show.detailInfo);
app.post('/show/posting', indexRouter.show.postMyShow);

app.get('/recommend/location', indexRouter.recommend.location);
app.get('/recommend/genre', indexRouter.recommend.genre);

app.post('/review/create', indexRouter.review.postCreate);
app.post('/review/update', indexRouter.review.postUpdate);
app.get('/review', indexRouter.review.getRead);
app.post('/review', indexRouter.review.postDelete);

const today = new Date().toISOString().replace(/-/g, '').replace('T','').replace(/:/g,'').substring(0,8);
let day = '';
if(day !== today){
  day = today;
  indexRouter.show.updateDB();
};

//에러 캐치
// app.use(function(err, req, res) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
//   res.render('error');
// });

// const port = process.env.port || 4000;

// let server;
// if(fs.existsSync("../key.pem") && fs.existsSync("../cert.pem")){

//   const privateKey = fs.readFileSync('..' + "/key.pem", "utf8");
//   const certificate = fs.readFileSync('..' + "/cert.pem", "utf8");
//   const credentials = { key: privateKey, cert: certificate };

//   server = https.createServer(credentials, app);
//   server.listen(port, () => console.log("server runnning"));

// } else {
//   server = app.listen(port)
// }

// module.exports = server;
module.exports = app;
