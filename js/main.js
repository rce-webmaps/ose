$(window).ready(function() {
  $('.loader').fadeOut("slow");

  $("#nextTimeSwitcher input").on("click", function() {
    if ($("#nextTimeSwitcher input:checked").val() === "on") {
      localStorage.setItem('popState', 'shown');
    } else {

      localStorage.setItem('popState', 'notShown');
    }
  })

  if (localStorage.getItem('popState') != 'shown') {
    console.log("show disclaimer");
    $('#disclaimer').modal('show');

  } else {
    console.log("hide disclaimer");
    $('#disclaimer').modal('hide');
  }
  $('#disclaimer-close').click(function(e) // You are clicking the close button
    {
      $('#disclaimer').fadeOut(); // Now the pop up is hiden.
      $('#disclaimer').modal('hide');
    });
});

$(".showFrontPage").on("click", function() {
  $('#disclaimer').modal('show');
  localStorage.setItem('popState', 'notShown');
})
// 1. Create a map object.
var mymap = L.map('map', {
  center: [44, -123.5],
  zoom: 7,
  maxZoom: 10,
  minZoom: 3,
  zoomcontrol: false,
  detectRetina: true
});

$(".leaflet-control-zoom").hide();

L.control.scale({
  // bottom: 50  ;
  position: 'topright'
}).addTo(mymap);

// 2. Add a base map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);

Promise.all([
      d3.csv('assets/shareLang.csv'),
      // d3.json('assets/districts.geojson'),
    ]).then(function(datasets) {
      var total = ["Total Population"];
      var engl = ["English Only"];
      var span = ["Spanish"];
      var fren = ["French, Haitian, or Cajun"];
      var germ = ["German or other West Germanic"];
      var russ = ["Russian, Polish, or other Slavic"];
      var indo = ["Other Indo-European"];
      var kore = ["Korean"];
      var chin = ["Chinese (incl. Mandarin, Cantonese)"];
      var viet = ["Vietnamese"];
      var tago = ["Tagolag (incl. Filipino)"];
      var otherAz = ["Other Asian and Pacific Island"];
      var arab = ["Arabic"];
      var other = ["Other and unspecified"];
      datasets[0].forEach(function(d) {
        total.push((d["total"]))
        engl.push(+d["shareEngl"])
        span.push(+d["shareSpan"])
        fren.push(+d["shareFren"])
        germ.push(+d["shareGerm"])
        russ.push(+d["shareRuss"])
        indo.push(+d["shareIndo"])
        kore.push(+d["shareKore"])
        chin.push(+d["shareChin"])
        viet.push(+d["shareViet"])
        tago.push(+d["shareTago"])
        otherAz.push(+d["shareOtherAz"])
        arab.push(+d["shareArab"])
        other.push(+d["shareOther"])
      });
var chart = c3.generate({
    data: {
        columns: [
            [engl, span, fren, germ, russ, indo, kore, chin, viet, tago, otherAz, arab, other],
        ],
        type : 'donut',
    },
    donut: {
        title: "Share"
    },
    bindto: "#chart"
});
});

// 6. Set function for color ramp
colors = chroma.scale('YlOrRd').colors(7); //colors = chroma.scale('OrRd').colors(5);

function setColor(density) {
  var id = 0;
  if (density > .94) {
    id = 6;
  } else if (density > .92 && density <= .94) {
    id = 5;
  } else if (density > .88 && density <= .92) {
    id = 4;
  } else if (density > .83 && density <= .88) {
    id = 3;
  } else if (density > .77 && density <= .83) {
    id = 2;
  } else if (density > .72 && density <= .77) {
    id = 1;
  } else {
    id = 0;
  }
  return colors[id];
}

// 7. Set style function that sets fill color.md property equal to cell tower density
function style(feature) {
  return {
    fillColor: setColor(feature.properties.id1),
    fillOpacity: 0.4,
    weight: 2,
    opacity: 1,
    color: '#b4b4b4',
    dashArray: '4'
  };
}

// 3. add the state layer to the map. Also, this layer has some interactive features.

// 3.1 declare an empty/null geojson object
var county = null;

// 3.2 interactive features.
// 3.2.1 highlight a feature when the mouse hovers on it.

function highlightFeature(e) {
  // e indicates the current event
  var layer = e.target; //the target capture the object which the event associates with
  layer.setStyle({
    weight: 8,
    opacity: 0.8,
    color: '#e3e3e3',
    fillColor: '#e3e00f',
    fillOpacity: 0.5
  });
  // bring the layer to the front.
  layer.bringToFront();
  // select the update class, and update the contet with the input value.
  $(".update").html(
    '<b>' + layer.feature.properties.county + ' County' + '</b><br>' +
    layer.feature.properties.id1 * 100 + '% Speaks only English<br>');
}
// 3.2.3 reset the hightlighted feature when the mouse is out of its region.
function resetHighlight(e) {
  county.resetStyle(e.target);
  $(".update").html("Hover over a county");
}

// 3.3 add these event the layer obejct.
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight
  });
}

// 3.4 assign the geojson data path, style option and onEachFeature option. And then Add the geojson layer to the map.
county = L.geoJson.ajax("assets/ORLang.geojson", {
  style: style,
  onEachFeature: onEachFeature
}).addTo(mymap);


// 9. Create Leaflet Control Object for Legend
var legend = L.control({
  position: 'bottomright'
});

// 10. Function that runs when legend is added to map
legend.onAdd = function() {

  // Create Div Element and Populate it with HTML
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML += '<b>% Speaks only English</b><br />';
  div.innerHTML += '<i style="background: ' + colors[6] + '; opacity: 0.5"></i><p>>94%</p>';
  div.innerHTML += '<i style="background: ' + colors[5] + '; opacity: 0.5"></i><p>93%-94%</p>';
  div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>89%-92%</p>';
  div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>83%-88%</p>';
  div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>77%-83%</p>';
  div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p>72%-77%</p>';
  div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p><72%</p>';
  // Return the Legend div containing the HTML content
  return div;
};
// 11. Add a legend to map
legend.addTo(mymap);

//attribution
$(".leaflet-control-attribution")
  .css("background-color", "transparent")
  .html("Supported by <a href='https://oregonexplorer.info/topics/rural-communities?ptopic=140' target='_blank'>The RCE @ Oregon State University </a> | Web Map by: <a href='#' target='_blank'>Benji Antolin");
