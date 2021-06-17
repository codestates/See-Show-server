const jwt = require('jsonwebtoken') 
const { review, show, User, github } = require("../../models");

const getId = async (req, res) => {
   let obj = {};
    //토큰 유효성 검사 => user_id, github_id 받아오기
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return 2;
    }else{
    let token = authorization.split(" ")[1];
    try {
      token = await jwt.verify(token, process.env.ACCESS_SECRET);
    } 
    catch (err) {
      const cookie = req.headers.cookie;
      if(!cookie) return 2;
        const realToken = cookie.split('=')[1];
        let decode;
        await jwt.verify(realToken, process.env.REFRESH_SECRET, (err,result) => {
          if(err) return 2;
          else decode = result;
        })
      if(decode.userId){
        const user = await User.findOne({where: {userId: decode.userId, email: decode.email}});
        let data = {...user.dataValues};
        delete data.password;
        token = await jwt.sign(data, process.env.ACCESS_SECRET, {expiresIn: '30s'});
      } else if(decode.login){
        const ghUser = await github.findOne({where: {userId: decode.login}});
        let data = ghUser.dataValues;
        token = await jwt.sign(data, process.env.ACCESS_SECRET, {expiresIn: '30s'});
      }
      token = await jwt.verify(token, process.env.ACCESS_SECRET);
      
    }

    if(!token.userId){
     const { login } = token;
     const githubInfo = await github.findOne({
       where : {login : login}
     })
    //  obj.github_id = githubInfo.dataValues.id
    //  obj.user_id = null
    //  return obj
     return {github_id : githubInfo.dataValues.id, user_id : null};
    } else {
       const {userId} = token;
       const userInfo = await User.findOne({
         where : {userId : userId}
       })
       return {user_id : userInfo.dataValues.id, github_id : null};
    }
  }
    
 }


module.exports = {
  postCreate: async (req,res) => {
    const {content, seq, point} = req.body;
    if(await getId(req,res) === 2){
      res.status(404).send({data: null, message: 'invalid access token'})
    }
    //user_id, github_id 할당받기
    const {github_id, user_id} = await getId(req, res);
    
    // seq 가지고 show_id 받아오기
    const showInfo = await show.findOne({
      where : {seq : seq}
    })
    const show_id = showInfo.dataValues.id;

    //리뷰 관련 정보 입력 필수. 정보가 부족할때 422 error 회신
    if(!content || !point){
      res.status(422).send("insufficient parameters supplied");
    } else {
      // 데이터 베이스에 생성
      await review.create({
        show_id : show_id,
        user_id : user_id,
        github_id : github_id,
        point :  point,
        content :  content })
      return res.status(200).send("OK")
    }
  },
  postUpdate: async (req, res) => {
    const {content, seq, point} = req.body;
    if(await getId(req,res) === 2){
      res.status(404).send({data: null, message: 'invalid access token'})
    }
    //user_id, github_id 할당받기
    const {github_id, user_id} = await getId(req, res);

    // seq 가지고 show_id 받아오기
    const showInfo = await show.findOne({
      where : {seq : seq}
    })
    const show_id = showInfo.id;    

    if(!content){
      return res.status(404).send("not found")
    } else {
      await review.update({
        point : point,
        content : content
      },{
        where:{ 
          show_id : show_id,
          user_id : user_id,
          github_id : github_id,
           },
      })
      return res.status(200).send("OK")
    }
  },
  postDelete: async (req, res) => {
    const {seq} = req.body;
    if(await getId(req,res) === 2){
      res.status(404).send({data: null, message: 'invalid access token'})
    }
    //user_id, github_id 할당받기
    const {github_id, user_id} = await getId(req, res);

    // seq 가지고 show_id 받아오기
    const showInfo = await show.findOne({
      where : {seq : seq}
    })
    const show_id = showInfo.id;      

    if(!show_id){
      return res.status(404).send("not found");
    } else {
      await review.destroy({where : {
        show_id : show_id,
        user_id : user_id,
        github_id : github_id,
      }});
      return res.status(200).send("OK");
    }
  },
  getRead: async(req, res) => {
    const {seq} = req.body;

    // seq 가지고 show_id 받아오기
    const showInfo = await show.findOne({
      where : {seq : seq}
    })
    const show_id = showInfo.dataValues.id;
    
    //user_id 가지고 username 받아오기
 
    const reviewInfo = await review.findAll({
      include : [{ model : User, as : userinfo },{ model : github, as : githubinfo }],
      where : {show_id : show_id},
    })

    const reviewData = reviewInfo.map((el) => {
      return {content : el.dataValues.content, point : el.dataValues.point, username : !!el.dataValues.userinfo.username ? el.dataValues.userinfo.username : el.dataValues.githubinfo.login}
      });
    
    if (!reviewInfo) { //입력한 정보가 데이터 베이스에 없을때(404 - notfound)
      return res.status(404).send("not found");
    } else { //입력한 정보가 기존 데이터 베이스에 있을때, 해당 ID만 회신을 줍니다.(200 - 에러 없이 전송)
      return res.status(200).send({data : reviewData, message : "OK"});
    }
  }
};
