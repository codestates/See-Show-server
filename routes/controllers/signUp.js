const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const axios = require('axios');
require('dotenv').config();

module.exports = {
  nat: async (req, res) => {
    const { userId, password, genre, area } = req.body;
    const userInfo = await User.findOne({where: {userId}})
    if(!userInfo){
      res.status(409).send("exists id");
    } else {
      await users.create({
        userId: userId,
        password: password,
        genre: genre,
        area: area
      },
      res.status(201).send("created"));
    }
  },
  fb: (req, res) => {

  },
  gg: (req, res) => {

  }
}