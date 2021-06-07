const jwt = require('jsonwebtoken');
const { User } = require('../../models'); // 데이터 베이스 연결 테이블명 User
require('dotenv').config();

module.exports = (req, res) => {
  const { userId, password } = req.body;
  User.findOne({where: {userId, password}})
    .then(data => {
      if(!data){
        res.status(401).send({data: null, message: 'not authorized'})
      } else {
        delete data.dataValues.password;
        const accessToken = jwt.sign(data.dataValues, process.env.ACCESS_SECRET, { expiresIn: "15s" });
        const refreshToken = jwt.sign(data.dataValues, process.env.REFRESH_SECRET, { expiresIn: "30d" });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
        });
        res.status(201).send({ data: { accessToken }, message: "ok" });
      }
    })
}
