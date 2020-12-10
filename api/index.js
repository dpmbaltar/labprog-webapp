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
  const { query:queryParams } = req // const queryParams = req.query
  const { error, value } = valid.weatherParamsSchema.validate(queryParams)

  if (error)
    return res.status(400).json(error)

  // Leer datos del archivo
  let rawdata = fs.readFileSync(dbFile)
  let db = JSON.parse(rawdata)

  // Estblecer params por defecto
  let { from = 0, days = 1 } = value
  let forecast = db.forecast.slice(from, from + days) // Devolver desde el elemento 0, cantidad de días
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
  const { body:newWeather } = req
  const { error, value:newValidWeather } = valid.weatherSchema.validate(newWeather)

  if (error)
    return res.status(400).json({ error: error })

  // Leer archivo dbschema.js
  try {
    let rawdata = fs.readFileSync(dbFile)
    let db = JSON.parse(rawdata)
    let found = db.forecast.find(element => element.date == newWeather.date)

    // Verificar si el elemento existe
    if (found)
      return res.status(400).json({error: 'El elemento ya existe'})

    // Modificar arreglo de datos
    db.forecast.push(newValidWeather)

    // convert JSON object to a string
    const data = JSON.stringify(db, null, 2);

    // Guardar archivo modificado
    fs.writeFileSync(dbFile, data, 'utf8');

  } catch (e) {
    console.log(`Error al leer archivo db.json: ${e}`)
    return res.status(500).json()
  }

  res.status(200).json(newValidWeather)
})

/**
 * Actualizar pronóstico
 */
app.put('/api/weather/update/:year/:month/:day', (req, res) => {
  const { params, body } = req
  const { year, month, day } = params
  const { error, value } = valid.weatherSchema.validate(body)

  if (error)
    return res.status(400).json(error)

  // Leer archivo dbschema.js
  let rawdata = fs.readFileSync(dbFile)
  let db = JSON.parse(rawdata)

  // Vertificar si la entrada existe
  // Modificar arreglo de datos
  // Guardar archivo modificado

  res.status(200).json(body)
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
