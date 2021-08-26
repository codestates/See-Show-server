const jwt = require('jsonwebtoken') 
const { review, show, User, github } = require("../../models");
const util = require('./utilFunction')

module.exports = {
  postCreate: async (req,res) => {
    const {content, seq, point} = req.body;
    //토큰유효성검사
    let newAccesstoken = await util.checkToken(req, res);
    if (!newAccesstoken) {
      return res.status(404).send("not found Accesstoken");
    }
    //userId, githubId 할당받기
    let userInfo = await util.getUserInfo(newAccesstoken);
    let githubId = userInfo.githubId;
    let userId = userInfo.id;
    
    // seq 가지고 showId 받아오기
    let strSeq = seq.toString();
    console.log("******** seq number : ", strSeq )
    const showInfo = await show.findOne({
      where : {seq : strSeq}
    })
    const showId = showInfo.dataValues.id;
    console.log("******** showId : ", showId )
    console.log("******** content : ", content )

    if(!content || !point){
      res.status(422).send("insufficient parameters supplied");
    } else {
      // 데이터 베이스에 생성
      await review.create({
        showId : showId,
        userId : userId,
        githubId : githubId,
        point :  point,
        content :  content })
      return res.status(200).send("OK")
    }
  },
  postUpdate: async (req, res) => {
    const {content, seq, point} = req.body;
    //토큰유효성검사
    let newAccesstoken = await util.checkToken(req, res);
    if (!newAccesstoken) {
      return res.status(404).send("not found Accesstoken");
    }
    //userId, githubId 할당받기
    let userInfo = await util.getUserInfo(newAccesstoken);
    let githubId = userInfo.githubId;
    let userId = userInfo.id;

    // seq 가지고 showId 받아오기
    let strSeq = seq.toString();
    const showInfo = await show.findOne({where : {seq : strSeq}})
    const showId = showInfo.dataValues.id;

    if(!content){
      return res.status(404).send("not found")
    } else {
      await review.update({
        point : point,
        content : content
      },{
        where:{ 
          showId : showId,
          userId : userId,
          githubId : githubId,
           },
      })
      return res.status(200).send("OK")
    }
  },
  postDelete: async (req, res) => {
    const {seq} = req.body;
    //토큰유효성검사
    let newAccesstoken = await util.checkToken(req, res);
    if (!newAccesstoken) {
      return res.status(404).send("not found Accesstoken");
    }
    //userId, githubId 할당받기
    let userInfo = await util.getUserInfo(newAccesstoken);
    let githubId = userInfo.githubId;
    let userId = userInfo.id;

    // seq 가지고 showId 받아오기
    let strSeq = seq.toString();
    const showInfo = await show.findOne({where : {seq : strSeq}})
    const showId = showInfo.dataValues.id;     

    if(!showId){
      return res.status(404).send("not found");
    } else {
      await review.destroy({where : {
        [Op.and] :[
          {showId : showId},
          {userId : userId},
          {githubId : githubId},
        ]
      }});
      return res.status(200).send("OK");
    }
  },
  postRead: async(req, res) => {
    const {seq} = req.body;

    // seq 가지고 showId 받아오기
    let strSeq = seq.toString();
    const showInfo = await show.findOne({where : {seq : strSeq}})
    const showId = showInfo.dataValues.id; 
    
    //userId 가지고 username 받아오기
    const reviewInfo = await review.findAll({
      include : [{ model : User, as : userinfo },{ model : github, as : githubinfo }],
      where : {showId : showId},
    })
    console.log("******* : ",reviewInfo )
    const reviewData = reviewInfo.map((el) => {
      return {
        content : el.dataValues.content, 
        point : el.dataValues.point, 
        username : !!el.dataValues.userinfo.username ? el.dataValues.userinfo.username : el.dataValues.githubinfo.login}
      });
    
    if (!reviewInfo) { //입력한 정보가 데이터 베이스에 없을때(404 - notfound)
      return res.status(404).send("not found");
    } else { //입력한 정보가 기존 데이터 베이스에 있을때, 해당 ID만 회신을 줍니다.(200 - 에러 없이 전송)
      return res.status(200).send({data : reviewData, message : "OK"});
    }
  }
};
