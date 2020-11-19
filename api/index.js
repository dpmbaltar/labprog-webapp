const express = require('express')
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
//const https = require('https');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 9001

/**
 * Weather API
 */
const weatherApiKey = '16a17a5b219940e093e213034201211'
const weatherApiBaseUrl = 'http://api.weatherapi.com/v1'
const weatherCache = {
  current: null,
  forecast: null
}

/**
 * Current
 */
app.get('/current', (req, res) => {
  const { params } = req
  let data = ''

  if (!weatherCache.current) {
    fetch(`${weatherApiBaseUrl}/current.json?key=${weatherApiKey}&q=Neuquen`)
    .then(res => res.json())
    .then((json) => {
      console.log('Return fetched from weather api')
      weatherCache.current = json
      res.send(weatherCache.current)
    })
  } else {
    console.log('Return cached current.json response')
    res.send(weatherCache.current)
  }
});

/**
 * Forecast
 */
app.get('/forecast', (req, res) => {
  const { params } = req
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
  }
});

app.get('/', (req, res) => {
  return res.sendStatus(400)
    /*fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=Neuquen`)
        .then(r => r.json())
        .then((json) => {
            console.log(json)
            res.send(json)
        })*/
    
    /*https.get(`https://api.weatherapi.com/v1/current.json?key=${key}&q=Neuquen`, (resp) => {
      
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            let obj = JSON.parse(data);

            console.log(data);
            console.log(obj.explanation);
          res.send(obj)
        });
      
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });*/
  })

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
