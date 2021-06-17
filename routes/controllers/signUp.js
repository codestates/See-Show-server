const { User } = require('../../models');

module.exports = {
  nat: async (req, res) => {
    const { userId, password, username, email } = req.body;
    const userInfo = await User.findOne({where: {userId}})
    if(userInfo){
      res.status(409).send("exists id");
    } else {
      await User.create({
        userId: userId,
        password: password,
        username: username,
        email: email,
        firstcheck: 1
      },
      res.status(201).send("created"));
    }
  }
}