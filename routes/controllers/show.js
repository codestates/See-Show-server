const axios = require('axios');
const convert = require('xml-js');
const { show } = require('../../models');
require('dotenv').config();

module.exports = {
  getList: async (req, res) => {
    const { searchWord } = req.body;
    await show.findAll({where: {[Op.or]: [
      {title: searchWord},
      {place: searchWord},
      {realmname: searchWord},
      {area: searchWord}
    ]}})
    .then(arr => {
      res.status(200).send({showList: arr});
    })
    .catch((err) => {
      res.status(404).send('not found');
    })
  },
  postMyShow: async (req, res) => {
    const { title, startDate, endDate, place, realmName, area, thumbnail, gpsX, gpsY } = req.body;
    if(!title || !startDate || !endDate || !place || !realmName || !area || !thumbnail || !gpsX || !gpsY){
      res.status(422).send("insufficient parameters supplied");
    } else {
      await show.create({
        seq: new Date().toISOString().replace(/-/g, '').replace('T','').replace(/:/g,'').substring(2,14),
        title : title,
        startDate: startDate,
        endDate: endDate,
        place: place,
        realmName: realmName,
        area: area,
        thumbnail: thumbnail,
        gpsX: gpsX,
        gpsY: gpsY
      })
      .then(() => res.status(201).send('upload complete'));
    }
  },
  updateDB: () => {
    const today = new Date().toISOString().replace(/-/g, '').replace('T','').replace(/:/g,'').substring(0,8);
    const afterSixMonth = (date) => {
      const month = today.slice(4,6);
      const sixMonth = Number(month) + 6;
      if(sixMonth > 12) sixMonth = sixMonth - 12;
      return today.replace(month, sixMonth);
    }
    axios({
      method: 'get',
      url: `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/period?serviceKey=${process.env.SHOW_API_KEY}&sortStdr=3&from=${today}&to=${afterSixMonth(today)}&cPage=1&rows=100&gpsxfrom=125.590&gpsyfrom=34.344&gpsxto=130.138&gpsyto=38.290`,
      responseType: 'json'
    })
    .then(data => {
      const convertData = convert.xml2js(data.data, {compact: true, spaces: 4});
      const list = convertData.response.msgBody.perforList;
      list.forEach((data) => {
        //findOrCreate로 바꾸기
        await show.findOrCreate({where: {seq: data.seq._text}}, { defaults: {
          seq: data.seq._text,
          title : data.title._text,
          startDate: data.startDate._text,
          endDate: data.endDate._text,
          place: data.place._text,
          realmName: data.realmName._text,
          area: data.area._text,
          thumbnail: data.thumbnail._text,
          gpsX: data.gpsX._text,
          gpsY: data.gpsY._text
        }})
      })
    })

  }
}








// (req, res) => {
// }