const { User, github } = require('../../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const util = require('./utilFunction')

module.exports = {
  myPage: (req, res) => {
    const data = util.checkToken(req)
    const user = util.getUserInfo(data)

      const { nickname } = user;
      if(!!nickname){
        User.findOne({ where: { nickname } })
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
        const { login } = user;
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
  // }
  // catch(err){
  //   console.log(err)
  // }
},
  withdraw: (req, res) => {
    const data = util.checkToken(req)
    if(!data){
      res.status(401).send({message: "No Authorization"})
    }
    const user = util.getUserInfo(data)
    const { nickname } = user;
    if(!!nickname){
      User.destroy({ where: { nickname } })
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
      const { login } = user;
      github.findOne({ where: { login } })
        .then((data) => {
          if (!data) {
            return res.status(401).send('there is not user information');
          }
          res.clearCookie("accessToken");
          req.session.destroy()
          return res.status(201).send('withdraw success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
}