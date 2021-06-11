var express = require('express');
var router = express.Router();

const { reviews } = require("../../models");
const { show } = require("../../models");
const { User } = require("../../models");
const { github } = require("../../models");

module.exports = {
  postCreate: async (req, res) => {
    const {content, seq, point} = req.body;

    //토큰 유효성 검사
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
    const { userId } = token;


    // seq 가지고 show_id 받아오기
    const showInfo = await show.findOne({
      where : {seq : seq}
    })
    const show_id = showInfo.id;

    // 토큰정보 가지고 user_id받아오기
    const userInfo = await User.findOne({
      where : {userId : userId}
    })
    const user_id = userInfo.id;

    // 토큰정보 가지고 github_id받아오기?????

    //리뷰 관련 정보 입력 필수. 정보가 부족할때 422 error 회신
    if(!content || !point){
      res.status(422).send("insufficient parameters supplied");
    } else {
      // 데이터 베이스에 생성
      await reviews.Create({
        show_id : show_id,
        user_id :  user_id,
        point :  point,
        content :  content})
      return res.status(200).send("OK")
    }
  },
  postUpdate: async (req, res) => {
    const {content, seq, point} = req.body;

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
        where:{ show_id : show_id },
      })
      return res.status(200).send("OK")
    }
  },
  postDelete: async (req, res) => {
    const {seq} = req.body;

    // seq 가지고 show_id 받아오기
    const showInfo = await show.findOne({
      where : {seq : seq}
    })
    const show_id = showInfo.id;      

    if(!show_id){
      return res.status(404).send("not found");
    } else {
      await reviews.destroy({where : {show_id : show_id}});
      return res.status(200).send("OK");
    }

  },
  getRead: async(req, res) => {
    const {seq} = req.body;
    // seq 가지고 show_id 받아오기
    const showInfo = await show.findOne({
      where : {seq : seq}
    })
    const show_id = showInfo.id;    

    const reviewInfo = await reviews.findOne({
      where : {show_id : show_id},
    })

    if (!reviewInfo) { //입력한 정보가 데이터 베이스에 없을때(404 - notfound)
      return res.status(404).send("not found");
    } else { //입력한 정보가 기존 데이터 베이스에 있을때, 해당 ID만 회신을 줍니다.(200 - 에러 없이 전송)
      return res.status(200).send({data : reviewInfo.dataValues, message : "OK"});
    }
  }
};
