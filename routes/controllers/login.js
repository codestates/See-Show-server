const jwt = require('jsonwebtoken');
const { User, github } = require('../../models'); // 데이터 베이스 연결 테이블명 User
require('dotenv').config();

module.exports = { 
  login: (req, res) => {
    const { userId, password } = req.body;
    User.findOne({where: {userId, password}})
    .then(data => {
      if(!data){
        res.status(401).send({data: null, message: 'not authorized'})
      } else {
        delete data.dataValues.password;
        const accessToken = jwt.sign(data.dataValues, process.env.ACCESS_SECRET, { expiresIn: "1d" });
        const refreshToken = jwt.sign(data.dataValues, process.env.REFRESH_SECRET, { expiresIn: "30d" });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
        });
        if(data.dataValues.firstcheck == 1) {
          res.status(201).send({ data: { accessToken: accessToken, usertype: 'nat', firstcheck: 1 }, message: "ok" });
        } else {
          res.status(201).send({ data: { accessToken: accessToken, usertype: 'nat'}, message: "ok" });
        }
      }
    })
  },
  logout: (req,res) => {
    delete req.headers.cookie;
    res.status(200).send('ok');
  }
}



