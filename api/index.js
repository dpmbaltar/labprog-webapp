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
    }
  ]
}

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
app.get('/forecast', (req, res) => {
  /*const { params } = req
  let data = ''

  if (!weatherCache.forecast) {
    fetch(`${weatherApiBaseUrl}/forecast.json?key=${weatherApiKey}&q=Neuquen&days=3`)
    .then(res => res.json())
    .then((json) => {
      console.log('Return fetched from weather api')
      weatherCache.forecast = json
      res.send(weatherCache.forecast)
    })
  } else {
    console.log('Return cached forecast.json response')
    res.send(weatherCache.forecast)
  }*/
})

app.get('/', (req, res) => {
  return res.sendStatus(400)
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
