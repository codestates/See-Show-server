const { User, github } = require("../../models");
const jwt = require("jsonwebtoken");
const refreshTokenRequest = require("./refreshTokenRequest");
require("dotenv").config();

module.exports = async (req, res) => {
  const authorization = req.headers["authorization"];
  const { genre, area } = req.body;
  if (!authorization) {
    res.status(404).send({ data: null, message: "invalid access token" });
  }
  let token = authorization.split(" ")[1];
  let toggle = 0;
  try {
    token = await jwt.verify(token, process.env.ACCESS_SECRET);
    console.log("verifytoken", token);
    if (token.nickname) {
      console.log("tryryryry");
      await User.update(
        { genre: genre, area: area, firstcheck: 0 },
        { where: { nickname: token.nickname } }
      ).then(() => {
        return res.status(201).send({ data: null, message: "update database" });
      });
    } else if (token.login) {
      await github
        .update(
          { genre: genre, area: area, firstcheck: 0 },
          { where: { login: token.login } }
        )
        .then(() =>
          res.status(201).send({ data: null, message: "update database" })
        );
    }
  } catch (err) {
    console.log("yapapap");
    token = await refreshTokenRequest(req);
    toggle = 1;
  }
};
