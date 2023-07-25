const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//get url

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    function getMarkerSize(magnitude) {
      return magnitude * 5;
    }
//marker color

    function getMarkerColor(depth) {
      if (depth < 10) return "green";
      else if (depth < 30) return "lightgreen";
      else if (depth < 50) return "yellow";
      else if (depth < 70) return "orange";
      else if (depth < 90) return "darkorange";
      else return "red";
    }
//map
    let map = L.map("map").setView([0, 0], 2);

    //add tile layer

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    data.features.forEach((earthquake) => {
      let lat = earthquake.geometry.coordinates[1];
      let lon = earthquake.geometry.coordinates[0];
      let mag = earthquake.properties.mag;
      let depth = Math.abs(earthquake.geometry.coordinates[2]); 
      let markerSize = getMarkerSize(mag);
      let markerColor = getMarkerColor(depth);
//marker size
      L.circleMarker([lat, lon], {
        radius: markerSize,
        fillColor: markerColor,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
      })
        .addTo(map)
        .bindPopup(
          `<b>Magnitude: ${mag}</b><br><b>Depth: ${depth} km</b><br><b>Location: ${earthquake.properties.place}</b>`
        );
    });
//create legend
    let maplegend = L.control({ position: "bottomright" });
    maplegend.onAdd = function (map) {
      let div = L.DomUtil.create("div", "info legend");
      let grades = [0, 10, 30, 50, 70, 90]; // Adjusted depth ranges
      

      div.innerHTML = "<h4>Depth (km)</h4>";
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getMarkerColor(grades[i] + 1) +
          '"></i> ' +
          grades[i] +
          (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
    maplegend.addTo(map);
  });

