// Creating map object
var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 2
});

const hexColors = [
    "#c4f069",
    "#e5f16a",
    "#f0db66",
    "#ebbb61",
    "#e6ab76",
    "#e17470"
]

const domain = [
    10,
    30,
    50,
    70,
    90,
    110
]

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(Data => {
    // d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson").then(Data => {
    var features = Data.features;

    // color scale
    var thresholdScale = d3.scaleThreshold()
        .domain(domain)
        .range(hexColors);

    // Loop through data
    features.forEach(d => {
        var coordinates = d.geometry.coordinates;
        var circle = L.circle([coordinates[1], coordinates[0]], {
            color: "black",
            weight: .5,
            fillColor: thresholdScale(coordinates[2]),
            fillOpacity: 0.8,
            radius: d.properties.mag * 50000
        }).addTo(myMap);
        circle.bindPopup(d.properties.title);
    });

    var svg = d3.select("svg");

    svg.append("rect")
        .attr("width", "120")
        .attr("height", "120")
        .attr("transform", "translate(0,120)")
        .attr("fill", "white");

    svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(10,130)")

    var legend = d3.legendColor()
        .labelFormat(d3.format(".0f"))
        .labels(d3.legendHelpers.thresholdLabels)
        .scale(thresholdScale)

    svg.select(".legend")
        .call(legend);
});