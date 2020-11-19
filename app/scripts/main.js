// Uncomment to enable Bootstrap tooltips
// https://getbootstrap.com/docs/4.0/components/tooltips/#example-enable-tooltips-everywhere
// $(function () { $('[data-toggle="tooltip"]').tooltip(); });

// Uncomment to enable Bootstrap popovers
// https://getbootstrap.com/docs/4.0/components/popovers/#example-enable-popovers-everywhere
// $(function () { $('[data-toggle="popover"]').popover(); });

/**
 * Get current day weather
 */
fetch('/api/current.json')
.then(response => response.json())
.then(response => {
  console.log(response)
  let tempElem = document.getElementsByClassName('temp')[0].innerHTML = response.temp
})
