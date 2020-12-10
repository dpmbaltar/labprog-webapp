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
 * Obtener pronóstico para una fecha
 */
app.get('/api/weather/:year/:month/:day', (req, res) => {
  const { params } = req // const params = req.params
  const { year = 1900, month = 1, day = 1 } = params
  const { error, value:weatherDate } = joi.date().iso().validate(`${year}-${month}-${day}`)

  if (error)
    return res.status(400).json({error: error})

  try {
    // Leer datos del archivo
    let rawdata = fs.readFileSync(dbFile)
    let db = JSON.parse(rawdata)

    // Buscar fecha
    let found = db.forecast.find(weather => {
      const d1 = Date.parse(weather.date)
      const d2 = weatherDate
      return d1.valueOf() === d2.valueOf()
    })

    // Devolver el elemento si fue encontrado
    if (found)
      res.status(200).json(found)
    else
      res.status(404).send()

  } catch (e) {
    console.log(`Error al leer archivo db.json: ${e}`)
    return res.status(500).json()
  }
})

/**
 * Obtener pronóstico actual
 */
app.get('/api/weather/forecast', (req, res) => {
  const { query:queryParams } = req // const queryParams = req.query
  const { error, value } = valid.weatherParamsSchema.validate(queryParams)

  if (error)
    return res.status(400).json({error: error})

  try {
    // Leer datos del archivo
    let rawdata = fs.readFileSync(dbFile)
    let db = JSON.parse(rawdata)

    // Establecer params por defecto
    let { from = 0, days = 1 } = value
    let forecast = db.forecast.slice(from, from + days) // Devolver desde el elemento 0, cantidad de días
    let total = db.forecast.length

    res.status(200).json({
      total: total,
      forecast: forecast
    })
  } catch (e) {
    console.log(`Error al leer archivo db.json: ${e}`)
    return res.status(500).json()
  }
})

/**
 * Crear pronóstico
 */
app.post('/api/weather/create', (req, res) => {
  const { body:newWeather } = req
  const { error, value:newValidWeather } = valid.weatherSchema.validate(newWeather)

  if (error)
    return res.status(400).json({ error: error })

  try {
    // Leer archivo dbschema.js
    let rawdata = fs.readFileSync(dbFile)
    let db = JSON.parse(rawdata)
    let found = db.forecast.find(element => {
      const d1 = Date.parse(element.date)
      const d2 = Date.parse(newValidWeather.date)
      return d1.valueOf() === d2.valueOf()
    })

    // Verificar si el elemento existe
    if (found)
      return res.status(400).json({error: 'El elemento ya existe'})

    // Modificar arreglo de datos
    db.forecast.push(newValidWeather)

    // convert JSON object to a string
    const data = JSON.stringify(db, null, 2);

    // Guardar archivo modificado
    fs.writeFileSync(dbFile, data, 'utf8');

    res.status(200).json(newValidWeather)

  } catch (e) {
    console.log(`Error al leer archivo db.json: ${e}`)
    return res.status(500).json()
  }
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
