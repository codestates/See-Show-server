const jwt = require('jsonwebtoken');
const { User, github } = require('../../models');

module.exports = async(req, res) => {
  const cookie = req.headers.cookie;
  if(!cookie) res.status(400).send({data: null, message: 'refresh token not provided'});
  const realToken = cookie.split('=')[1];
  let decode;
  await jwt.verify(realToken, process.env.REFRESH_SECRET, (err,result) => {
    if(err) res.status(400).send({data: null, message: 'invalid refresh token, please log in again'});
    else decode = result;
  })
  if(decode.userId){
    const user = await User.findOne({where: {userId: decode.userId, email: decode.email}});
    let data = {...user.dataValues};
    delete data.password;
    const token1 = await jwt.sign(data, process.env.ACCESS_SECRET, {expiresIn: '30s'});
    res.status(200).send({data: {accessToken: token1}, message: 'ok'});
  } else if(decode.login){
    const ghUser = await github.findOne({where: {userId: decode.login}});
    let data = ghUser.dataValues;
    const tokengh = await jwt.sign(data, process.env.ACCESS_SECRET, {expiresIn: '30s'});
    res.status(200).send({data: {accessToken: tokengh}, message: 'ok'});
  }
}
