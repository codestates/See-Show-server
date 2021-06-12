var express = require('express');
var router = express.Router();

const { reviews } = require("../../models");
const { show } = require("../../models");
const { User } = require("../../models");
const { github } = require("../../models");

let user_id, github_id, user_name = '';

 const getId = function(){
    //토큰 유효성 검사 => user_id, github_id 받아오기
    const authorization = req.headers["authorization"];
    if (!authorization) {
      res.status(404).send({data: null, message: 'invalid access token'})
    }
    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, process.env.ACCESS_SECRET);
    } catch (err) {
      res.status(404).send({data: null, message: 'invalid access token'})
    }

    if(!token.userId){
      const { login } = token;
      const githubInfo = await github.findOne({
        where : {login : login}
      })
      github_id = githubInfo.dataValues.id;
    } else {
      const {userId} = token;
      const userInfo = await User.findOne({
        where : {userId : userId}
      })
      user_id = userInfo.dataValues.id;
      user_name = userInfo.dataValues.username;
    }
 }


module.exports = {
  postCreate: async (req, res) => {
    const {content, seq, point} = req.body;

    //user_id, github_id 할당받기
    getId();

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
      await reviews.Create({
        show_id : show_id,
        user_id :  !!user_id ? user_id : undefined,
        github_id : !!github_id ? github_id : undefined,
        point :  point,
        content :  content })
      return res.status(200).send("OK")
    }
  },
  postUpdate: async (req, res) => {
    const {content, seq, point} = req.body;

    //user_id, github_id 할당받기
    getId();

    // seq 가지고 show_id 받아오기
    const showInfo = await show.findOne({
      where : {seq : seq}
    })
    const show_id = showInfo.id;    

    if(!content){
      return res.status(404).send("not found")
    } else {
      await reviews.update({
        point : point,
        content : content
      },{
        where:{ 
          show_id : show_id,
          user_id :  !!user_id ? user_id : undefined,
          github_id : !!github_id ? github_id : undefined,
           },
      })
      return res.status(200).send("OK")
    }
  },
  postDelete: async (req, res) => {
    const {seq} = req.body;

    //user_id, github_id 할당받기
    getId();

    // seq 가지고 show_id 받아오기
    const showInfo = await show.findOne({
      where : {seq : seq}
    })
    const show_id = showInfo.id;      

    if(!show_id){
      return res.status(404).send("not found");
    } else {
      await reviews.destroy({where : {
        show_id : show_id,
        user_id :  !!user_id ? user_id : undefined,
        github_id : !!github_id ? github_id : undefined,
      }});
      return res.status(200).send("OK");
    }
  },
  getRead: async(req, res) => {
    const {seq} = req.body;
    //user_id, github_id 할당받기
    getId();
    // seq 가지고 show_id 받아오기
    const showInfo = await show.findOne({
      where : {seq : seq}
    })
    const show_id = showInfo.id;
    
    //user_id 가지고 username 받아오기

    const reviewInfo = await reviews.findAll({
      where : {show_id : show_id},
    })

    if (!reviewInfo) { //입력한 정보가 데이터 베이스에 없을때(404 - notfound)
      return res.status(404).send("not found");
    } else { //입력한 정보가 기존 데이터 베이스에 있을때, 해당 ID만 회신을 줍니다.(200 - 에러 없이 전송)
      return res.status(200).send({data : 
        { username : user_name,
          content : reviewInfo.dataValues.content
        }, message : "OK"});
    }
  }
};
