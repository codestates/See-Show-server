require('dotenv').config();
const axios = require('axios')
const cookieParser = require('cookie-parser')
cookieParser()

utilFunctions = {
  getToken: async(req,res)=> {
      const authorization = req.headers["authorization"];
      const { genre, area } = req.body;
      if (!authorization) {
          res.status(404).send({data: null, message: 'invalid access token'})
      }
      let token = authorization.split(" ")[1];
      let toggle = 0;
      let verifytoken;
      try {
          verifytoken = await jwt.verify(token, process.env.ACCESS_SECRET);
      } catch (err) {
          token = await refreshTokenRequest(req)
          toggle = 1;
      }
  }
}