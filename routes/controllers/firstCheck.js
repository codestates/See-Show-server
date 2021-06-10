const { User,github } = require('../../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res) => {
  const authorization = req.headers["authorization"];
  const { userType, genre, area } = req.body;
  if (!authorization) {
    res.status(404).send({data: null, message: 'invalid access token'})
  }
  const token = authorization.split(" ")[1];
  try {
    token = jwt.verify(token, process.env.ACCESS_SECRET);
  } catch (err) {
    res.status(404).send({data: null, message: 'invalid access token'});
  }
  if(userType == 'nat'){
    await User.update({genre: genre, area: area},{where: {userId: token.userId}})
    .then(()=> res.status(201).send({data: null, message: 'update database'}));
  } else if(userType == 'github'){
    await github.update({genre: genre, area: area}, {where: {login: token.login}})
    .then(()=> res.status(201).send({data: null, message: 'update database'}));
  }

  //보완 필요
}