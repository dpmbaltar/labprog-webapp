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

  function createWeatherRow() {
    var row = document.createElement("div")
    var col = document.createElement("div")
    var cols = ["date", "temp", "detail", "humid", "wind"]

    row.setAttribute("class", "row")
    cols.forEach(element => {
      col.setAttribute("class", "col " + element)
      row.appendChild(col)
      col = col.cloneNode()
    })

    return row
  }

  router
    .on('/current', function () {
      /**
       * Get current day weather
       */
      console.log("Getting current weather...")

      fetch('/api/current.json')
        .then(response => response.json())
        .then(response => {
          console.log(response)
          let tempElem = document.getElementsByClassName('temp')[0].innerHTML = response.temp
        })
    })
    .on('/forecast', function () {
      /**
       * Get forecast weather
       */
      console.log("Getting forecast...")

      fetch('/api/forecast.json')
        .then(response => response.json())
        .then(response => {
          console.log(response)
          let section = document.getElementById("forecast") || createSection()
          section.setAttribute("id", "forecast")

          if (Array.isArray(response)) {
            response.forEach(element => {
              let row = createWeatherRow()
              console.log(row)
              row.firstChild.textContent = element.temp
              section.appendChild(row)
            })
          }

          container.appendChild(section)
        })
    })
    .resolve();
})()
