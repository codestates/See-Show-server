const { User,github } = require('../../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res) => {
  const authorization = req.headers["authorization"];
  const { genre, area } = req.body;
  if (!authorization) {
    res.status(404).send({data: null, message: 'invalid access token'})
  }
  const token = authorization.split(" ")[1];
  try {
    token = jwt.verify(token, process.env.ACCESS_SECRET);
    if(token.userId){
      await User.update({genre: genre, area: area, firstcheck: 0},{where: {userId: token.userId}})
      .then(()=> res.status(201).send({data: null, message: 'update database'}));
    } else if(token.login){
      await github.update({genre: genre, area: area, firstcheck: 0}, {where: {login: token.login}})
      .then(()=> res.status(201).send({data: null, message: 'update database'}));
    }
  } catch (err) {
    res.status(404).send({data: null, message: 'invalid access token'});
  }
}