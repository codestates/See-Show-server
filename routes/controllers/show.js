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
      {realmName: searchWord},
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
  updateDB: async () => {
    const today = new Date().toISOString().replace(/-/g, '').replace('T','').replace(/:/g,'').substring(0,8);
    const afterSixMonth = (today) => {
      const month = today.slice(4,6);
      const sixMonth = Number(month) + 6;
      if(sixMonth > 12) sixMonth = sixMonth - 12;
      return today.replace(month, sixMonth);
    }
    await axios({
      method: 'get',
      url: `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/period?serviceKey=${process.env.SHOW_API_KEY}&sortStdr=3&from=${today}&to=${afterSixMonth(today)}&cPage=1&rows=100&gpsxfrom=125.590&gpsyfrom=34.344&gpsxto=130.138&gpsyto=38.290`,
      responseType: 'json'
    })
    .then(async(res) => {
      const convertData = convert.xml2js(res.data, {compact: true, spaces: 4});
      const list = convertData.response.msgBody.perforList;
      const newList = list.map(data => {return {
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

      // await show.bulkCreate(newList, {fields : ['seq', 'title', 'startDate', 'endDate', 'place', 'realmName', 'area', 'thumbnail', 'gpsX', 'gpsY'],
      //   updateOnDuplicate: ['seq', 'title', 'startDate', 'endDate', 'place', 'realmName', 'area', 'thumbnail', 'gpsX', 'gpsY'],
      // })

        await Promise.all(newList.map(data => show.findOrCreate(
          { where: {seq: data.seq}, 
           defaults: {
              seq: data.seq,
              title : data.title,
              startDate: data.startDate,
              endDate: data.endDate,
              place: data.place,
              realmName: data.realmName,
              area: data.area,
              thumbnail: data.thumbnail,
              gpsX: data.gpsX,
              gpsY: data.gpsY
            }
          }
        )))
      
    })
  },
  detailInfo: async (req,res) => {
    const { seq } = req.body;
    await axios({
      method: 'get',
      url: `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/d/?serviceKey=Uvn8iqDKsX3S63IN1wKut0PE8fpEeV6dhkxAkJKsesXwivt%2FD3DpOB0i2cyG7MUjC%2FZIfNr2gGM%2F70tQXlM%2Byw%3D%3D&seq=${seq}`,
      responseType: 'json'
    })
    .then(data => {
      const convertData = convert.xml2js(data.data, {compact: true, spaces: 4});
      const { 
        title, 
        startDate, 
        endDate, 
        place, 
        realmName, 
        area, 
        subTitle, 
        price, 
        contents1, 
        contents2, 
        url, 
        phone, 
        imgUrl, 
        gpsX, 
        gpsY, 
        placeUrl, 
        placeAddr 
      } = convertData.response.msgBody.perforInfo;
      res.status(200).send({data: {
        title: title._text, 
        startDate: startDate._text, 
        endDate: endDate._text, 
        place: place._text, 
        realmName: realmName._text, 
        area: area._text, 
        subTitle: subTitle._text, 
        price: price._text, 
        contents1: contents1._text, 
        contents2: contents2._text, 
        url: url._text, 
        phone: phone._text, 
        imgUrl: imgUrl._text, 
        gpsX: gpsX._text, 
        gpsY: gpsY._text, 
        placeUrl: placeUrl._text, 
        placeAddr: placeAddr._text 
      }, message: 'ok'})
    })
  }
}