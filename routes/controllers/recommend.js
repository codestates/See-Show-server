const { show } = require('../../models');
const jwt = require('jsonwebtoken');
const util = require('./utilFunction')

module.exports = {
  location: async (req,res) =>{
    let token = await util.checkToken(req)
    // const authorization = req.headers["authorization"];
    if (!token) {
      await show.findAll({where: {area: '서울'}})
       .then(arr => {
         const list = arr.map(el => el.dataValues).slice(0,5);
         res.status(200).send({data: {list: list}, message: 'ok'})
       })
      //  .catch(error => res.status(404))
    } else {
      // const token = authorization.split(" ")[1];
      // try {
      //   jwt.verify(token, process.env.ACCESS_SECRET);
      // } catch (err) {
      const user = util.getUserInfo(token)
      const { area } = user;
      await show.findAll({where: {area: area}})
      .then(arr => {
        const getRandomNumber = (min, max) => {
          return Math.random() * (max - min) + min;
        }
        const list = arr.map(el => el.dataValues).splice(getRandomNumber(0, arr.dataValues.length - 6), 5);
        res.status(200).send({data: {list: list}, message: 'ok'})
      })
    }
  },
  genre: async (req,res) => {
    let token = await util.checkToken(req)
    if (!token) {
      await show.findAll({where: {realmname: '음악'}})
       .then(arr => {
         const list = arr.map(el => el.dataValues).slice(0,5);
         res.status(200).send({data: {list: list}, message: 'ok'})
       })
    }else{
    const user = util.getUserInfo(token)
    const { genre } = user;
    await show.findAll({where: {realmName: genre}})
     .then(arr => {
      const getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min;
      }
      const list = arr.map(el => el.dataValues).splice(getRandomNumber(0, arr.dataValues.length - 6), 5);
      res.status(200).send({data: {list: list}, message: 'ok'})
     })
    }
  }
}