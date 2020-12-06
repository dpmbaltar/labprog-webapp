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

  let { from = 0, days = 1 } = value
  let forecast = db.forecast.slice(from, days)
  let total = db.forecast.length

  res.status(200).json({
    total: total,
    forecast: forecast
  })
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
