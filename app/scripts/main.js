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

  var timestamp = 0
  var cache = null
  var container = document.getElementById("main")

  function createSection() {
    let section = document.createElement("section")
    section.setAttribute("class", "section")
    return section
  }
  
  function newWeatherRow() {
    return document.getElementById("forecast").getElementsByClassName("row")[0].cloneNode(true)
  }

  router
    .on('/current', function () {
      /**
       * Obtener pronóstico para hoy
       */
      console.log("Getting current weather...")

      fetch('/api/current.json')
        .then(response => response.json())
        .then(response => {
          console.log(response)
          let weather = response
          let container = document.getElementById("current")
          
          // Mostrar datos
          container.querySelector("[data-name='temp']").innerHTML = `${weather.temp} &deg;C`
          container.querySelector("[data-name='condition']").textContent = weather.condition.text
          container.querySelector("[data-name='wind']").textContent = `${weather.windDir} ${weather.wind} km/h`
        })
    })
    .on('/forecast', function () {
      /**
       * Obtener pronóstico para los próximos días
       */
      console.log("Getting forecast...")

      fetch('/api/forecast.json')
        .then(response => response.json())
        .then(response => {
          console.log(response)
          let section = document.getElementById("forecast") || createSection()
          section.setAttribute("id", "forecast")

          if (Array.isArray(response)) {
            // Recorrer arreglo de objetos obtenidos
            response.forEach(weather => {
              let row = newWeatherRow()
              let dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
              let dateTimeFormat = new Intl.DateTimeFormat('es-AR', dateOptions);
              
              // Disponer los datos en las columnas
              row.querySelector("[data-name='date']").textContent = dateTimeFormat.format(new Date(weather.date))
              row.querySelector("[data-name='temp']").innerHTML = `${weather.temp} &deg;C`
              row.querySelector("[data-name='icon']").src = weather.condition.icon
              row.querySelector("[data-name='cond']").textContent = weather.condition.text
              row.querySelector("[data-name='humidity']").textContent = `${weather.humidity}%`
              row.querySelector("[data-name='wind']").textContent = `${weather.windDir} ${weather.wind} km/h`
              
              // Agregar y mostrar fila
              row.style.display = "flex"
              section.appendChild(row)
            })
          }
          
          // Agregar fila al contenedor
          container.appendChild(section)
        })
    })
    .resolve();
})()
