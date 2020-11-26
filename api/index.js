const express = require('express')
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
//const https = require('https');
const joi = require('joi');
const { build } = require('joi');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 9001

const bd = {
  current: {
    date: '2020-11-27',
    temp: 33,
    condition: {
      text: 'Soleado',
      icon: 'images/sunny.png'
    },
    wind: 13,
    windDir: "N",
    humidity: 19
  },
  forecast: [
    {
      date: '2020-11-27',
      temp: 33,
      condition: {
        text: 'Soleado',
        icon: 'images/sunny.png'
      },
      wind: 13,
      windDir: "N",
      humidity: 19
    },
    {
      date: '2020-11-28',
      temp: 8,
      condition: {
        text: 'Lluvia',
        icon: 'images/cloudy.png'
      },
      wind: 13,
      windDir: "N",
      humidity: 19
    }
  ]
}

const schema = joi.object({
  /*date: joi.date()
    //.format('YYYY-MM-DD')
    //.min(today())
    .message('"date" cannot be earlier than today')
    //.max(tomorrow() + 10)
    .message('"date" cannot be later than tomorrow +10')
    .required(),*/

  temp: joi.number()
    .min(-273)
    .message('"temp" cannot be minor to 273')
    .max(150)
    .message('"temp" cannot be mayor to 150')
    .required(),

}).with('date', 'temp')

app.post('/create.json', (req, res) => {
  const { params, body } = req
  if (!schema.validate(body)) {
    res.sendStatus(204)
  } else {
    res.send(body)
  }
})

/**
 * Current
 */
app.get('/current.json', (req, res) => {
  if (!bd.current) {
    res.sendStatus(204)
  } else {
    res.send(bd.current)
  }
})

/**
 * Forecast
 */
app.get('/forecast.json', (req, res) => {
  if (!bd.forecast) {
    res.sendStatus(204)
  } else {
    res.send(bd.forecast)
  }
})

app.get('/', (req, res) => {
  return res.sendStatus(400)
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
