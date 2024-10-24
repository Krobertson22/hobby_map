//HEAD
// Initialize the Leaflet map
const map = L.map('map').setView([-37.83045, 144.97439], 17); // Replace with your desired coordinates and zoom level



 // Add OpenStreetMap tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 15.7,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Define a variable to hold your GeoJSON layer
let geoJsonLayer;

//BODY

// Load plaques.geojson
var plaquesLayer = L.geoJSON(null, {
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.title_of_plaque);
    }
}).addTo(map);

 // Fetch GeoJSON data and add it to the map
 fetch('plaques.geojson') // Replace with the actual path to your GeoJSON file
 .then(response => response.json())
 .then(data => {
     L.geoJSON(data).addTo(map);

     // Add the search control to the map
    const searchControl = new CustomSearchControl({ layer: geoJsonLayer });
    map.addControl(new CustomSearchControl({ layer: geoJsonLayer }));
 })

 fetch('property_lines.geojson') // Replace with the actual path to your GeoJSON file
 .then(response => response.json())
 .then(data => {
     L.geoJSON(data).addTo(map);
 })

 .catch(error => {
     console.error('Error loading GeoJSON:', error);
 });


// LEAFLET 
class CustomSearchControl extends L.Control {
    constructor(options) {
        super(options);
        this._layer = options.layer; // Store the provided GeoJSON layer
    }

    onAdd(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const input = L.DomUtil.create('input', 'leaflet-control-search');

        input.placeholder = 'Search...'; // Placeholder text for the search input
        container.appendChild(input);

        // Event listener for input changes
        input.addEventListener('input', () => {
            const searchTerm = input.value.trim().toLowerCase(); // Trim whitespace and convert to lower case

            // Check for hazardous input
            if (!this.isValidInput(searchTerm)) {
                this.resetStyles(); // Reset styles for all layers if input is invalid
                return; // Exit early if the input is invalid
            }

            // Reset styles for all layers
            this.resetStyles();

            // Search logic
            let anyMatchFound = false; // Track if any match is found
            this._layer.eachLayer(layer => {
                const properties = layer.feature.properties;

                // Search in the specified fields
                const searchFields = [
                    properties.asset_number,
                    properties.title_of_plaque,
                    properties.description_of_plaque,
                    properties.tree_common_name,
                    properties.tree_scientific_name,
                    properties.date_of_tree_planted
                ];

                const found = searchFields.some(field => 
                    field && field.toString().toLowerCase().includes(searchTerm)
                );

                // Highlight matching features
                if (found) {
                    layer.setStyle({ fillColor: 'yellow' }); // Highlight color for matching features
                    anyMatchFound = true; // Set flag if a match is found
                }
            });

            // Optional: log if no matches were found
            if (!anyMatchFound) {
                console.log("No matches found");
            }
        });

        return container; // Return the control container
    }

    // Function to reset styles for all layers
    resetStyles() {
        this._layer.eachLayer(layer => {
            layer.setStyle({ fillColor: 'blue' }); // Default style
        });
    }

    // Function to validate input
    isValidInput(input) {
        // Check for null, undefined, and length
        if (!input || input.length < 2) {
            return false; // Invalid if empty or less than 2 characters
        }
        // Optionally, check for harmful characters
        const invalidChars = /[^a-z0-9\s]/; // Allow only alphanumeric characters and spaces
        return !invalidChars.test(input); // Return true if input is safe
    }
}

