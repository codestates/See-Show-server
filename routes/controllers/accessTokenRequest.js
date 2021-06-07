const { User } = require('../../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    res.status(404).send({data: null, message: 'invalid access token'})
  }
  const token = authorization.split(" ")[1];
  try {
    jwt.verify(token, process.env.ACCESS_SECRET);
  } catch (err) {
    res.status(404).send({data: null, message: 'invalid access token'})
  }
  const { userId } = token;
  User.findOne({ where: { userId } })
    .then((data) => {
      if (!data) {
        return res.status(401).send({data: null, message: 'access token has been tempered'});
      }
      delete data.dataValues.password;
      return res.status(201).send({ data: { userInfo: data.dataValues }, message: 'ok' });
    })
    .catch((err) => {
      console.log(err);
    });
}
