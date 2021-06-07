const axios = require('axios');
const convert = require('xml-js');
const { User } = require('../../models');
require('dotenv').config();

module.exports = (req, res) => {
  axios({
    method: 'get',
    url: 'http://www.culture.go.kr/openapi/rest/publicperformancedisplays/period?serviceKey=Uvn8iqDKsX3S63IN1wKut0PE8fpEeV6dhkxAkJKsesXwivt%2FD3DpOB0i2cyG7MUjC%2FZIfNr2gGM%2F70tQXlM%2Byw%3D%3D&sortStdr=3&from=20210607&to=20211231&cPage=1&rows=3&gpsxfrom=125.590&gpsyfrom=34.344&gpsxto=130.138&gpsyto=38.290',
    responseType: 'json'
  })
  .then(data => {
    const convertData = convert.xml2js(data.data, {compact: true, spaces: 4});
    console.log(convertData.response.msgBody.perforList)
  })
}