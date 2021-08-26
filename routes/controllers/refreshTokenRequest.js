const jwt = require('jsonwebtoken');
const { User, github } = require('../../models');

module.exports = async(req) => {
  const cookie = req.headers.cookie;
  //쿠키가 없는경우 2
  if(!cookie) return 2;
  const realToken = cookie.split('refreshToken=')[1];
  let decode = await jwt.verify(realToken, process.env.REFRESH_SECRET)
  //jwt 에 userId가 있는 경우
  if(decode.userId){
    const user = await User.findOne({where: {userId: decode.userId, email: decode.email}});
    let data = {...user.dataValues};
    delete data.password;
    return await jwt.sign(data, process.env.ACCESS_SECRET, {expiresIn: '30s'});
  } else if(decode.login){//깃헙로그인
    const ghUser = await github.findOne({where: {userId: decode.login}});
    let data = ghUser.dataValues;
    return await jwt.sign(data, process.env.ACCESS_SECRET, {expiresIn: '30s'});
  }
    else{
      return undefined
    }
}