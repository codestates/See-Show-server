const jwt = require('jsonwebtoken');
const { User } = require('../../models');

module.exports = (req, res) => {
  const cookie = req.headers.cookie;
  if(!cookie) res.status(400).send({data: null, message: 'refresh token not provided'});
  const realToken = cookie.split('=')[1];
  const decode;
  await jwt.verify(realToken, process.env.REFRESH_SECRET, (err,result) => {
    if(err) res.status(400).send({data: null, message: 'invalid refresh token, please log in again'});
    else decode = result;
  })
  const user = await User.findOne({where: {userId: decode.userId, email: decode.email}});
  let data = {...user.dataValues};
  delete data.password;
  const token1 = await jwt.sign(data, process.env.ACCESS_SECRET, {expiresIn: '30s'});
  res.status(200).send({data: {accessToken: token1}, message: 'ok'});
}
