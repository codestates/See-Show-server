const { show } = require('../../models');
const jwt = require('jsonwebtoken');

module.exports = {
  location: async (req,res) =>{
    const authorization = req.headers["authorization"];
    if (!authorization) {
      await show.findAll({where: {area: '서울'}})
       .then(arr => {
         const list = arr.map(el => el.dataValues).slice(0,5);
         res.status(200).send({data: {list: list}, message: 'ok'})
       })
      //  .catch(error => res.status(404))
    } else {
      const token = authorization.split(" ")[1];
      try {
        jwt.verify(token, process.env.ACCESS_SECRET);
      } catch (err) {
        await show.findAll({where: {area: '서울'}})
        .then(arr => {
          const list = arr.map(el => el.dataValues).slice(0,5);
          res.status(200).send({data: {list: list}, message: 'ok'})
        })
      }
      const { area } = token;
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
    const authorization = req.headers["authorization"];
    if (!authorization) {
      await show.findAll({where: {realmname: '음악'}})
       .then(arr => {
         const list = arr.map(el => el.dataValues).slice(0,5);
         res.status(200).send({data: {list: list}, message: 'ok'})
       })
    }
    const token = authorization.split(" ")[1];
    try {
      jwt.verify(token, process.env.ACCESS_SECRET);
    } catch (err) {
      await show.findAll({where: {realmname: '음악'}})
       .then(arr => {
         const list = arr.map(el => el.dataValues).slice(0,5);
         res.status(200).send({data: {list: list}, message: 'ok'})
       })
    }
    const { genre } = token;
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