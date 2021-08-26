const { User,github } = require('../../models');
const jwt = require('jsonwebtoken');
const refreshTokenRequest = require('./refreshTokenRequest')
require('dotenv').config();
const util = require('./utilFunction')

module.exports = async (req, res) => {
  // const authorization = req.headers["authorization"];
  const { genre, area } = req.body;
  // if (!authorization) {
  //   res.status(404).send({ data: null, message: "invalid access token" });
  // }
  // let token = authorization.split(" ")[1];
  // let toggle = 0;
  // let verifytoken;
  // try {
  //   verifytoken = await jwt.verify(token, process.env.ACCESS_SECRET);
  // } catch (err) {
  //   //jwt 가 아니면 refreshtoken을 요청한다.
  //   token = await refreshTokenRequest(req)//새로운 accesstoken 받음
  //   toggle = 1;
  // }
  const checktoken = util.checkToken(req)
  if(!checktoken){
    return res.status(400).send({ message: 'invalid refresh token, please log in again' })
  }
  const userinfo = util.getUserInfo(checktoken)


  // if(toggle === 1){//토큰을 새로 받은 경우,
  //   verifytoken = await jwt.verify(token, process.env.ACCESS_SECRET);
    if(userinfo.nickname){//일반로그인
      await User.update({genre: genre, area: area, firstcheck: 0},{where: {nickname: userinfo.nickname}})
      .then((resp)=> {
        //쿠키에 토큰넣기
        const newuser = {...userinfo, genre, area}
        res.cookie("accessToken", checktoken,{httpOnly:true})
        return res.status(201).send({data: {accessToken : checktoken, userinfo: newuser}, message: 'update database'})});
    } else if(userinfo.login){//깃헙로그인

      await github.update({genre: genre, area: area, firstcheck: 0}, {where: {login: userinfo.login}})
      .then(()=> {
        res.cookie("accessToken", checktoken,{httpOnly:true})
        return res.status(201).send({data: {accessToken : checktoken }, message: 'update database'})
      });
    }
  // } else{ //toggle !==1 
    // if(verifytoken.userId){
    //   await User.update({genre: genre, area: area, firstcheck: 0},{where: {userId: verifytoken.userId}})
    //   .then(()=> {
    //     return res.status(201).send({data: null, message: 'update database'})});
    // } else if(verifytoken.login){
    //   await github.update({genre: genre, area: area, firstcheck: 0}, {where: {login: verifytoken.login}})
    //   .then(()=> res.status(201).send({data: null, message: 'update database'}));
    // }
  // }
}
