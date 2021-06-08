const axios = require('axios');


module.exports = {
  fbOAuth: (req) => {
    return axios({
      method: 'get',
      url: `https://graph.facebook.com/v10.0/oauth/access_token`,
      headers: {
        accept: 'application/json',
      },
      data: {
        client_id: process.env.FB_CLIENT_ID,
        client_secret: process.env.FB_CLIENT_SECRET,
        code: req.body.authorizationCode,
        // redirect_uri: 'FILL ME IN'
      }
    })
  },
  ggOAuth: async (req) => {
    if(typeof req.query.code != 'undefined'){
      //https://www.googleapis.com/oauth2/v4/token
      await axios({
        method: 'get',
        url: `https://oauth2.googleapis.com/token?code=${req.query.code}&client_id=${process.env.GG_CLIENT_ID}&client_secret=${process.env.GG_CLIENT_SECRET}&redirect_uri=https://localhost:3000/ggOAuth&grant_type=authorization_code`,
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded'
        }
      })
    } else {
      return {accessToken : req.body.access_token, refreshToken: req.body.refresh_token}
    }
      //https://accounts.google.com/o/oauth2/auth?client_id=143836767350-96ieh2blthq9qc0nakah5jbdv4b587ee.apps.googleusercontent.com&response_type=token&scope=https://www.googleapis.com/auth/user.birthday.read&redirect_uri=https://localhost:3000/ggOAuth
  }


}