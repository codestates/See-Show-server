const { User, github } = require('../../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  myPage: (req, res) => {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      res.status(404).send({data: null, message: 'invalid access token'})
    }
    let token = authorization.split(" ")[1];
    try {
      token = jwt.verify(token, process.env.ACCESS_SECRET);
      const { userId } = token;
      if(!!userId){
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
      } else {
        const { login } = token;
        github.findOne({ where: { login } })
          .then((data) => {
            if (!data) {
              return res.status(401).send({data: null, message: 'access token has been tempered'});
            }
            return res.status(201).send({ data: { userInfo: data.dataValues }, message: 'ok' });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err) {
      res.status(404).send({data: null, message: 'invalid access token'})
    }
  },
  withdraw: (req, res) => {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      res.status(404).send({data: null, message: 'invalid access token'})
    }
    let token = authorization.split(" ")[1];
    try {
     token = jwt.verify(token, process.env.ACCESS_SECRET);
    } catch (err) {
      res.status(404).send({data: null, message: 'invalid access token'})
    }
    const { userId } = token;
    if(!!userId){
      User.destroy({ where: { userId } })
        .then((data) => {
          if (!data) {
            return res.status(401).send('there is not user information');
          }
          return res.status(201).send('withdraw success');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const { login } = token;
      github.findOne({ where: { login } })
        .then((data) => {
          if (!data) {
            return res.status(401).send('there is not user information');
          }
          return res.status(201).send('withdraw success');
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }

}