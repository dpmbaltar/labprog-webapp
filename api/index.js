const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const app = express()
const joi = require('joi')
const { build } = require('joi')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 9001

const db = require('./db.js')
const dbschema = require('./dbschema.js')

/**
 * Crear pronostico
 */
app.post('/create.json', (req, res) => {
  const { params, body } = req
  if (!schema.validate(body)) {
    res.sendStatus(204)
  } else {
    res.send(body)
  }
})

/**
 * Pronóstico actual
 */
app.get('/current.json', (req, res) => {
  if (!db.current) {
    res.sendStatus(204)
  } else {
    res.send(db.current)
  }
})

/**
 * Pronóstico siguiente
 */
app.get('/forecast.json', (req, res) => {
  if (!db.forecast) {
    res.sendStatus(204)
  } else {
    res.send(db.forecast)
  }
})

app.get('/', (req, res) => {
  return res.sendStatus(400)
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
