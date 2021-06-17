const { User } = require('../../models');
const nodemailer = require('nodemailer');
// const emailjs = require('emailjs-com'); //emailjs-com
// nodemailer.init(process.env.EMAIL_ID);

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});


module.exports = {
  find: async (req, res) => {
    const { userId, email } = req.body;
    const userInfo = await User.findOne({where: {userId : userId, email: email}})
    let userEmail = userInfo.dataValues.email
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: userEmail,
      subject: 'seeShow 비밀번호 재생성 안내메일 입니다.',
      // 보내는 메일의 내용을 입력
      // html: html로 작성된 내용
      // text: {hello : '안녕하세요. seeShow 관리자입니다.ㅎㅎ'},
      html: `<p><img src="https://camo.githubusercontent.com/a92cdfe9839a88a51ffa359f728f3a87277c488a3e11b2fe11aeb3b76914ec0a/68747470733a2f2f6d656469612e646973636f72646170702e6e65742f6174746163686d656e74732f3835303234353936383438343839323638332f3835313735343839323335353034333333382f73656573686f775f6c6f676f5f66756c6c5f70726f746f747970652e706e67" alt="Logo" width="470" height="106" /></p>
      <p>안녕하세요 ${userId} 고객님,</p>
      <p>항상 저희 seeShow를 이용해주셔서 감사합니다.</p>
      <p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;"><a href="https://localhost:3001/resetpw">seeShow 비밀번호 재생성</a></p>
      <p>위 링크를 통해 비밀번호를 수정하세요!</p>`,
    });

  },
  change: async (req, res) => {
    console.log("*******", req.body)
    const { userId, password } = req.body;
    await User.update({password: password}, {where: {userId: userId}})
     .then(() => res.status(201).send('update database'));
  }
}
