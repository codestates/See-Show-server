const jwt = require('jsonwebtoken');
const { User } = require('../../models'); // 데이터 베이스 연결 테이블명 User
const axios = require('axios');
require('dotenv').config();

module.exports = {
  nat: (req, res) => {
    const { userId, password } = req.body;
    User.findOne({where: {userId, password}})
      .then(data => {
        if(!data){
          res.status(401).send({data: null, message: 'not authorized'})
        } else {
          delete data.dataValues.password;
          const accessToken = jwt.sign(data.dataValues, process.env.ACCESS_SECRET, { expiresIn: "15s" });
          const refreshToken = jwt.sign(data.dataValues, process.env.REFRESH_SECRET, { expiresIn: "30d" });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
          });
          res.status(201).send({ data: { accessToken }, message: "ok" });
        }
      })
  },
  fb: (req, res) => {
    axios({
    method: 'post',
    url: `https://graph.facebook.com/v10.0/oauth/access_token`,
    headers: {
      accept: 'application/json',
      },
    data: {
      client_id: process.env.FB_CLIENT_ID,
      client_secret: process.env.FB_CLIENT_SECRET,
      code: req.body.authorizationCode
      }
    }).then((response) => {
      accessToken = response.data.access_token;
      res.status(200).send({ accessToken: accessToken });
    }).catch(err => {
      res.status(404)
    })
    // `https://www.facebook.com/v10.0/dialog/oauth?client_id=317119936709492&redirect_uri=${메인페이지url 넣어주세요}` //client OauthUrl
  },
  gg: (req, res) => {
    
  }
}


