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
app.post('/login', indexRouter.login);

app.get('/accessTokenRequest', indexRouter.accessTokenRequest);

app.get('/refreshTokenRequest', indexRouter.refreshTokenRequest);

app.get('/myPage', indexRouter.myPage);

app.get('/show', indexRouter.show);

app.get('/location', indexRouter.location);

app.get('/reviewGet', indexRouter.reviewGet);
app.post('/reviewPost', indexRouter.reviewPost);


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
