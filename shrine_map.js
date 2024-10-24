
// Initialize the Leaflet map
const map = L.map('map').setView([144.97439, 37.83045], 13); // Replace with your desired coordinates and zoom level



 // Add OpenStreetMap tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);




 // Fetch GeoJSON data and add it to the map
 fetch('path/to/your/data.geojson') // Replace with the actual path to your GeoJSON file
 .then(response => response.json())
 .then(data => {
     L.geoJSON(data).addTo(map);
 })
 
 .catch(error => {
     console.error('Error loading GeoJSON:', error);
 });

