
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

function activatePage(pageNumber) {
  let forecastContent = document.getElementById("forecast-content")
  let forecastPage = document.getElementById("forecast-page-" + pageNumber)

  forecastContent.querySelectorAll("div").forEach(element => {
    element.setAttribute("class", "d-none")
  })

  if (!forecastPage) {

  }
  
  forecastPage.setAttribute("class", "")
}

function getElementByName(element, name) {
  return element.querySelector(`[data-name="${name}"]`)
}

function newWeatherRow() {
  return document.getElementById("forecast").getElementsByClassName("row")[0].cloneNode(true)
}

function newWeatherPage(pageNumber, buttonText) {
  let a = document.createElement("a")
  let li = document.createElement("li")

  a.setAttribute("class", "page-link")
  a.setAttribute("href", "#!/weather/forecast/" + pageNumber)
  a.textContent = buttonText

  li.setAttribute("class", "page-item")
  li.appendChild(a)
  
  return li
}

/**
 * Muestra las páginas del pronóstico.
 * @param {Number} totalPages la cantidad total de páginas
 */
function showWeatherForecastPages(totalPages) {
  let pageContainer = document.getElementById("forecast-pagination")

  if (totalPages <= 1)
    return pageContainer.setAttribute("class", "d-none")
  
  let pageList = document.getElementById("forecast-page-list")
  pageList.innerHTML = ""

  for (let i = 1; i <= totalPages; i++)
    pageList.appendChild(newWeatherPage(i, i))

  pageContainer.setAttribute("class", "")
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

  fetch('/api/weather/forecast?from=0&days=1')
    .then(response => response.json())
    .then(response => {
      let weather = response.forecast[0]
      let section = document.getElementById("current")

      // Mostrar datos
      getElementByName(section, "temp").textContent = `${weather.temp} °C`
      getElementByName(section, "condition").textContent = weather.condition
      getElementByName(section, "wind").textContent = `${weather.windDir} ${weather.wind} km/h`

      weatherCurrentHandler.cacheTime = new Date()
      activateSection("current")
    }).catch(error => {
      console.log(error)
    })
}

/**
 * Obtener pronóstico para los próximos dóas
 */
function weatherForecastHandler(params) {
  const days = 3 // Días por página
  let { totalDays = -1 } = weatherForecastHandler
  let { page = 1 } = params
  let from = days * (page - 1)

  fetch(`/api/weather/forecast?from=${from}&days=${days}`)
    .then(response => response.json())
    .then(response => {
      let container = document.getElementById("forecast-content")

      if (response.forecast) {
        // Recorrer arreglo de objetos obtenidos
        response.forecast.forEach(weather => {
          let row = newWeatherRow() // Crea la fila HTML
          let dateOptions = { weekday: 'short', /*month: 'short',*/ day: 'numeric' };
          let dateTimeFormat = new Intl.DateTimeFormat('es-AR', dateOptions);

          // Disponer los datos en las columnas
          getElementByName(row, "date").textContent = dateTimeFormat.format(new Date(weather.date))
          getElementByName(row, "temp").textContent = weather.temp
          getElementByName(row, "icon").src = weather.icon
          getElementByName(row, "icon").alt = weather.condition
          getElementByName(row, "condition").textContent = weather.condition
          getElementByName(row, "precip").textContent = weather.precip
          getElementByName(row, "wind").textContent = weather.wind
          getElementByName(row, "windDir").textContent = weather.windDir

          // Agregar y mostrar fila
          row.setAttribute("class", "row")
          container.appendChild(row)
        })

        // Mostrar páginas si es necesario
        if (totalDays < 0 || totalDays != response.total) {
          totalDays = response.total
          showWeatherForecastPages(parseInt(totalDays / days))
        }
      }

      activateSection("forecast")
    })
}

function rootHandler() {
  router.navigate("/weather/current");
}

const router = new Navigo("http://localhost:9000/", true, '#!');

router
  .on({
    '*': rootHandler,
    '/weather/current': weatherCurrentHandler,
    '/weather/forecast/:page': weatherForecastHandler
  })
  .resolve()

