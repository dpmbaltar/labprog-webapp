const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const joi = require('joi')
const { build } = require('joi')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 9001

const dbFile = 'api/db.json'
const valid = require('./dbschema.js')

/**
 * Obtener pronóstico actual
 */
app.get('/api/weather/forecast', (req, res) => {
  const { query:queryParams } = req
  const { error, value } = valid.weatherParamsSchema.validate(queryParams)
  
  if (error)
    return res.status(400).json(error)

  let rawdata = fs.readFileSync(dbFile)
  let db = JSON.parse(rawdata)
  let weather = db.forecast.slice(value.from, value.days)

  if (weather.length == 0)
    res.status(204)

  res.status(200).json(weather)
})

/**
 * Crear pronóstico
 */
app.post('/api/weather/create', (req, res) => {
  const { params, body } = req
  // Hacer
})

/**
 * Actualizar pronóstico
 */
app.put('/api/weather/update/:year/:month/:day', (req, res) => {
  const { params, body } = req
  // Hacer
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
