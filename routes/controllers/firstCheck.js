const { User,github } = require('../../models');
const jwt = require('jsonwebtoken');
const refreshTokenRequest = require('./refreshTokenRequest')
require('dotenv').config();

module.exports = async (req, res) => {

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

  if(toggle === 1){
    verifytoken = await jwt.verify(token, process.env.ACCESS_SECRET);
    if(verifytoken.userId){
      await User.update({genre: genre, area: area, firstcheck: 0},{where: {userId: verifytoken.userId}})
      .then(()=> {
        return res.status(201).send({data: {accessToken : token }, message: 'update database'})});
    } else if(verifytoken.login){
      await github.update({genre: genre, area: area, firstcheck: 0}, {where: {login: verifytoken.login}})
      .then(()=> res.status(201).send({data: {accessToken : token }, message: 'update database'}));
    }
  } else{
    if(verifytoken.userId){
      await User.update({genre: genre, area: area, firstcheck: 0},{where: {userId: verifytoken.userId}})
      .then(()=> {
        return res.status(201).send({data: null, message: 'update database'})});
    } else if(verifytoken.login){
      await github.update({genre: genre, area: area, firstcheck: 0}, {where: {login: verifytoken.login}})
      .then(()=> res.status(201).send({data: null, message: 'update database'}));
    }
  }
}