const emailjs = require('emailjs-com');
const { User } = require('../../models');
emailjs.init(process.env.EMAIL_ID);

module.exports = {
  find: async (req, res) => {
    const { userId, email } = req.body;
    await User.findOne({where: {userId : userId, email: email}})
     .then((data)=> {
      emailjs.send(process.env.EMAIL_SERVICE_ID, process.env.EMAIL_TEMPLETE_ID, {
        to_name: data.dataValues.username,
        user_email: data.dataValues.email // 이게 문제될지도 모름 https://dashboard.emailjs.com/admin/templates
      });
      res.status(201);
     })
  },
  change: async (req, res) => {
    const { userId, password } = req.body;
    await User.update({password: password}, {where: {userId: userId}})
     .then(() => res.status(201).send('update database'));
  }
}
