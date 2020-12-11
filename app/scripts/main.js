
/**
 * Activa una sección <section> con id="sectionId", dentro del <main id="main">
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
 * Devuelve un elemento contenido en otro por el atributo "data-name".
 */
function getElementByName(element, name) {
  return element.querySelector(`[data-name="${name}"]`)
}

/**
 * Clona y devuelve una fila HTML para el pronóstico.
 */
function newWeatherRow() {
  return document.getElementById("forecast").getElementsByClassName("row")[0].cloneNode(true)
}

/**
 * Crea y devuelve una nueva página del pronóstico.
 */
function newWeatherPage(pageNumber, buttonText) {
  let a = document.createElement("a")
  let li = document.createElement("li")

  a.textContent = buttonText
  a.setAttribute("class", "page-link btn-dark")
  a.setAttribute("href", "#!/weather/forecast/" + pageNumber)

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
  const date = new Date()
  const dateString = date.toISOString().split('T')[0].replaceAll('-', '/')

  fetch(`/api/weather/${dateString}`)
    .then(response => response.json())
    .then(response => {
      let weather = response
      let section = document.getElementById("current")

      // Mostrar datos
      getElementByName(section, "temp").textContent = `${weather.temp} °C`
      getElementByName(section, "condition").textContent = weather.condition
      getElementByName(section, "icon").alt = weather.condition
      getElementByName(section, "icon").src = 'images/256/' + weather.icon
      getElementByName(section, "wind").textContent = `${weather.windDir} ${weather.wind} km/h`

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
  let { page = 1 } = params || {}
  let from = days * (page - 1)
  let pages = 0

  fetch(`/api/weather/forecast?from=${from}&days=${days}`)
    .then(response => response.json())
    .then(response => {
      let container = document.getElementById("forecast-content")
      container.innerHTML = ""

      if (response.forecast) {
        // Recorrer arreglo de objetos obtenidos
        response.forecast.forEach(weather => {
          let row = newWeatherRow() // Crea la fila HTML
          let dateOptions = { weekday: 'short', day: 'numeric' }
          let dateTimeFormat = new Intl.DateTimeFormat('es-AR', dateOptions)

          // Disponer los datos en las columnas
          getElementByName(row, "date").textContent = dateTimeFormat.format(new Date(weather.date))
          getElementByName(row, "temp").textContent = weather.temp
          getElementByName(row, "icon").src = 'images/64/' + weather.icon
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
          pages = parseInt(totalDays / days)
          pages+= (totalDays % days) > 0 ? 1 : 0
          showWeatherForecastPages(pages)
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
    '/weather/forecast': weatherForecastHandler,
    '/weather/forecast/:page': weatherForecastHandler
  })
  .resolve()

