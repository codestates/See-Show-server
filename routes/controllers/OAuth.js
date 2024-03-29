const axios = require('axios');
const { github } = require('../../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = async (req, res) => {
  await axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token`,
    headers: {
      accept: 'application/json',
    },
    data: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: req.body.authorizationCode
    }
  }).then(async (response) => {
    accessToken = response.data.access_token;
    await axios.get('https://api.github.com/user', {
      headers: {
        authorization: `token ${accessToken}`,
      }
    })
      .then(async data => {
        const { login, id } = data.data;
        let userinfo = await github.findOne({where: {login}});
        if(!userinfo){
          await github.create({login: login, name: id, firstcheck: 1});
          userinfo = await github.findOne({where: {login}});
        };
        const serverToken = jwt.sign(userinfo.dataValues, process.env.ACCESS_SECRET, { expiresIn: "15d" });
        const refreshToken = jwt.sign(userinfo.dataValues, process.env.REFRESH_SECRET, { expiresIn: "30d" });
        req.session.refreshToken = refreshToken
        res.cookie("accessToken", serverToken, {
          httpOnly: true,
        });
        if(userinfo.dataValues.firstcheck == 1){
          res.status(201).send({data: {usertype: 'github', firstcheck: 1}, messege: 'ok'});
        } else {
          res.status(201).send({data: {usertype: 'github'}, messege: 'ok'});
        }
      })
  }).catch(e => {
    res.status(404)
  });
  // https://github.com/login/oauth/authorize?client_id=a904f09f2c93d6013422
}




// {
//   fbOAuth: (req) => {
//     return axios({
//       method: 'get',
//       url: `https://graph.facebook.com/v10.0/oauth/access_token`,
//       headers: {
//         accept: 'application/json',
//       },
//       data: {
//         client_id: process.env.FB_CLIENT_ID,
//         client_secret: process.env.FB_CLIENT_SECRET,
//         code: req.body.authorizationCode,
//         // redirect_uri: 'FILL ME IN'
//       }
//     })
//   },
//   ggOAuth: async (req) => {
//     if(typeof req.query.code != 'undefined'){
//       //https://www.googleapis.com/oauth2/v4/token
//       await axios({
//         method: 'get',
//         url: `https://oauth2.googleapis.com/token?code=${req.query.code}&client_id=${process.env.GG_CLIENT_ID}&client_secret=${process.env.GG_CLIENT_SECRET}&redirect_uri=https://localhost:3000/ggOAuth&grant_type=authorization_code`,
//         headers: {
//           "Content-Type": 'application/x-www-form-urlencoded'
//         }
//       })
//     } else {
//       return {accessToken : req.body.access_token, refreshToken: req.body.refresh_token}
//     }
//       //https://accounts.google.com/o/oauth2/auth?client_id=143836767350-96ieh2blthq9qc0nakah5jbdv4b587ee.apps.googleusercontent.com&response_type=token&scope=https://www.googleapis.com/auth/user.birthday.read&redirect_uri=https://localhost:3000/ggOAuth
//   }


// }