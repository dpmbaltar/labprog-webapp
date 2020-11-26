// Uncomment to enable Bootstrap tooltips
// https://getbootstrap.com/docs/4.0/components/tooltips/#example-enable-tooltips-everywhere
// $(function () { $('[data-toggle="tooltip"]').tooltip(); });

// Uncomment to enable Bootstrap popovers
// https://getbootstrap.com/docs/4.0/components/popovers/#example-enable-popovers-everywhere
// $(function () { $('[data-toggle="popover"]').popover(); });

(function() {
  var root = null;
  var useHash = true; // Defaults to: false
  var hash = '#!'; // Defaults to: '#'
  var router = new Navigo(root, useHash, hash);

  var cache = []

  function newWeatherRow() {
    return document.getElementById("forecast").getElementsByClassName("row")[0].cloneNode(true)
  }

  function getElementByName(element, name) {
    return element.querySelector(`[data-name="${name}"]`)
  }

  function activateSection(sectionId) {
    let main = document.getElementById("main")
    let section = document.getElementById(sectionId)

    main.querySelectorAll("section").forEach(element => {
      element.style.display = "none"
    })
    section.style.display = "block"
  }

  router
    .on('/current', function () {
      /**
       * Obtener pronóstico para hoy
       */
      console.log("Getting current weather...")

      if (cache["current"]) {
        activateSection("current")
        return
      }

      fetch('/api/current.json')
        .then(response => response.json())
        .then(response => {
          let weather = response
          let section = document.getElementById("current")

          // Mostrar datos
          getElementByName(section, "temp").innerHTML = `${weather.temp} &deg;C`
          getElementByName(section, "condition").textContent = weather.condition
          getElementByName(section, "wind").textContent = `${weather.windDir} ${weather.wind} km/h`

          cache["current"] = true
          activateSection("current")
        })
    })
    .on('/forecast', function () {
      /**
       * Obtener pronóstico para los próximos dóas
       */
      if (cache["forecast"]) {
        console.log("Cached forecast...")
        activateSection("forecast")
        return
      }

      console.log("Getting forecast...")

      fetch('/api/forecast.json')
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
              getElementByName(row, "condition").textContent = weather.condition
              getElementByName(row, "precip").textContent = `${weather.precip}%`
              getElementByName(row, "wind").textContent = `${weather.windDir} ${weather.wind} km/h`

              // Agregar y mostrar fila
              row.style.display = "flex"
              section.appendChild(row)
            })
          }

          cache["forecast"] = true
          activateSection("forecast")
        })
    })
    .resolve()
    router.navigate("/current");
})()
