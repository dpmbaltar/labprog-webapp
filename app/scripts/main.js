
const router = new Navigo("http://localhost:9000/", true, '#!');

function newWeatherRow() {
  return document.getElementById("forecast").getElementsByClassName("row")[0].cloneNode(true)
}

function getElementByName(element, name) {
  return element.querySelector(`[data-name="${name}"]`)
}

/**
 * Activa una sección <section> con id="sectionId", dentro del <main id="main">
 *
 * @param {String} sectionId el id de la sección
 */
function activateSection(sectionId) {
  let main = document.getElementById("main")
  let section = document.getElementById(sectionId)

  main.querySelectorAll("section").forEach(element => {
    element.style.display = "none"
  })
  section.style.display = "block"
}

/**
 * Obtener pronóstico para hoy
 */
function weatherCurrentHandler() {
  console.log("Getting current weather...")
  weatherCurrentHandler.cacheTime = weatherCurrentHandler.cacheTime || 0

  let time = new Date()
  let elapsedTime = (time - weatherCurrentHandler.cacheTime) / 1000

  if (elapsedTime < 30) {
    console.log(`Cached current weather... Will update in ${30-elapsedTime} seconds`)
    return activateSection("current")
  }

  fetch('/api/weather/forecast')
    .then(response => response.json())
    .then(response => {
      let weather = response[0]
      let section = document.getElementById("current")

      // Mostrar datos
      getElementByName(section, "temp").innerHTML = `${weather.temp} &deg;C`
      getElementByName(section, "condition").textContent = weather.condition
      getElementByName(section, "wind").textContent = `${weather.windDir} ${weather.wind} km/h`

      weatherCurrentHandler.cacheTime = new Date()
      activateSection("current")
    })
}

/**
 * Obtener pronóstico para los próximos dóas
 */
function weatherForecastHandler() {
  console.log("Getting forecast...")
  weatherForecastHandler.cacheTime = weatherForecastHandler.cacheTime || 0

  let time = new Date()
  let elapsedTime = (time - weatherForecastHandler.cacheTime) / 1000

  if (elapsedTime < 30) {
    console.log(`Cached forecast... Will update in ${30-elapsedTime} seconds`)
    return activateSection("forecast")
  }

  let from = 0
  let days = 10

  fetch(`/api/weather/forecast?from=${from}&days=${days}`)
    .then(response => response.json())
    .then(response => {
      let section = document.getElementById("forecast-content")

      // Verificar datos
      if (Array.isArray(response)) {
        // Recorrer arreglo de objetos obtenidos
        response.forEach(weather => {
          let row = newWeatherRow()
          let dateOptions = { weekday: 'short', /*month: 'short',*/ day: 'numeric' };
          let dateTimeFormat = new Intl.DateTimeFormat('es-AR', dateOptions);

          // Disponer los datos en las columnas
          getElementByName(row, "date").textContent = dateTimeFormat.format(new Date(weather.date))
          getElementByName(row, "temp").innerHTML = `${weather.temp} &deg;C`
          getElementByName(row, "icon").src = weather.icon
          getElementByName(row, "icon").alt = weather.condition
          getElementByName(row, "condition").textContent = weather.condition
          getElementByName(row, "precip").textContent = `${weather.precip}%`
          getElementByName(row, "wind").textContent = `${weather.windDir} ${weather.wind} km/h`

          // Agregar y mostrar fila
          row.style.display = "flex"
          section.appendChild(row)
        })
      }

      weatherForecastHandler.cacheTime = new Date()
      activateSection("forecast")
    })
}

function rootHandler() {
  router.navigate("/weather/current");
}

router
  .on({
    '*': rootHandler,
    '/weather/current': weatherCurrentHandler,
    '/weather/forecast': weatherForecastHandler
  })
  .resolve()

