const { User } = require('../../models');

module.exports = {
  nat: async (req, res) => {
    const { userId, password } = req.body;
    const userInfo = await User.findOne({where: {userId}})
    if(!userInfo){
      res.status(409).send("exists id");
    } else {
      await users.create({
        userId: userId,
        password: password
      },
      res.status(201).send("created"));
    }
  }
}