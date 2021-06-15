// const emailjs = require('emailjs-com'); //emailjs-com
const { Users } = require('../../models');
// emailjs.init(process.env.EMAIL_ID);
// console.log("******** : ", emailjs)

module.exports = {
  find: async (req, res) => {
    const { userId, email } = req.body;
    await Users.findOne({where: {userId : userId, email: email}})
     .then(async(data)=> {
      await emailjs.sendForm(process.env.EMAIL_SERVICE_ID, process.env.EMAIL_TEMPLETE_ID, {
        to_name: data.dataValues.username,
        // user_email: data.dataValues.email // 이게 문제될지도 모름 https://dashboard.emailjs.com/admin/templates
      }, process.env.EMAIL_ID );
      res.status(201);
     })
  },
  change: async (req, res) => {
    const { userId, password } = req.body;
    await User.update({password: password}, {where: {userId: userId}})
     .then(() => res.status(201).send('update database'));
  }
}
