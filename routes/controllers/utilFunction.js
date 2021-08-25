require('dotenv').config();
const axios = require('axios')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
cookieParser()

module.exports = {
   //토큰유효성 검사
   checkToken: (req , res)=> {
      const { authorization } = req.headers
      if (!authorization) {
      return res.status(401).send({ message: 'Unauthorized' })
      }
      const token = authorization.split(" ")[1];
      //accesstoken디코딩
      const data = jwt.verify(token, process.env.ACCESS_SECRET);
      if (!data) {//accesstoken 이 없는 경우 -> 리프레스토큰 확인
            //refreshtoken decoding
            let decoding = jwt.verify(token, process.env.REFRESH_SECRET)
            //리프레시토큰도 만료 된 경우,
            if(!decoding ){ 
                  // return res.status(400).send({ message: 'invalid refresh token, please log in again' })
                  return;
            }
            //유효한 리프레시 토큰이 있는경우, 새로운 accesstoken 만들어준다
            else { 
                  let newAccessToken = jwt.sign(data, process.env.ACCESS_SECRET,{expiresIn:'1d'})
                  return newAccessToken
            }
      }else{//accesstoken이 있는경우
            return authorization
      }
  },
      
//   getToken: async(req,res) =>{
//       const getAccessToken = (data) =>{
//             return jwt.sign(data, processs.env.ACCESS_SECRET,{
//                   expiresIn: "1s"
//             })
//       }
//       const getRefreshToken = (data) => {
//             return jwt.sign(data, process.env.REFRESH_SECRET,{
//                   expiresIn:'1d'
//             })
//       }

//   }
  getUserInfo: (token)=>{    
      const puretoken = token.split(' ')[1]
      const userInfo= jwt.verify(puretoken,process.env.ACCESS_SECRET)
      return userInfo
  }
}