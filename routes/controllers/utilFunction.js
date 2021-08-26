require('dotenv').config();
const axios = require('axios')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
cookieParser()

module.exports = {
   //토큰유효성 검사
   checkToken: (req)=> {
      const authorization  = req.headers.cookie
      if (!authorization) {// 아예 토큰이 없는 경우
      return ;
      }
      const token = authorization.split("=")[1]
      const refreshtoken = req.session.refreshToken;
      //accesstoken디코딩
      let result =  jwt.verify(token, process.env.ACCESS_SECRET, (err,res)=>{
            if(err){
                  return jwt.verify(refreshtoken, process.env.REFRESH_SECRET, (err,res)=>{
                        if(err){
                              return;
                        }else{
                              console.log(`***thisisjwt.sign`, jwt.sign)
                        let newAccessToken = jwt.sign(res, process.env.ACCESS_SECRET)
                              return newAccessToken
                        }
                  })
            }else{
                  return token;
            }
      })

      return result;
  },
      
  getUserInfo: (token)=>{    
      // const puretoken = token.split(' ')[1]
      const userInfo= jwt.verify(token,process.env.ACCESS_SECRET)
      return userInfo
  }
}