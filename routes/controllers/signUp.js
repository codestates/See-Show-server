const { User } = require('../../models');

module.exports = {
  nat: async (req, res) => {
    const { nickname, password, username, email } = req.body;
    const userInfo = await User.findOne({where: {nickname}})
    if(userInfo){
      res.status(409).send("exists id");
    } else {
      await User.create({
        nickname: nickname,
        password: password,
        username: username,
        email: email,
        firstcheck: 1
      },
      res.status(201).send("created"));
    }
  }
}