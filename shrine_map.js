//HEAD
// Initialize the Leaflet map
const map = L.map('map').setView([-37.83045, 144.97439], 5); // Replace with your desired coordinates and zoom level



 // Add OpenStreetMap tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//BODY

 // Fetch GeoJSON data and add it to the map
 fetch('plaques.geojson') // Replace with the actual path to your GeoJSON file
 .then(response => response.json())
 .then(data => {
     L.geoJSON(data).addTo(map);
 })

 fetch('property_lines.geojson') // Replace with the actual path to your GeoJSON file
 .then(response => response.json())
 .then(data => {
     L.geoJSON(data).addTo(map);
 })

 .catch(error => {
     console.error('Error loading GeoJSON:', error);
 });


//LEAFLET


class CustomSearchControl extends L.Control {
    constructor(options) {
        super(options);
        this._layer = options.layer;
    }

    onAdd(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const input = L.DomUtil.create('input', 'leaflet-control-search');
        
        input.placeholder = 'Search...';
        container.appendChild(input);
        
        // Event listener for input changes
        input.addEventListener('input', () => {
            const searchTerm = input.value.toLowerCase();
            
            // Reset styles for all layers
            this._layer.eachLayer(layer => {
                layer.setStyle({ fillColor: 'blue' }); // Default style
            });

            // Search logic
            this._layer.eachLayer(layer => {
                const properties = layer.feature.properties;
                const searchFields = [
                    properties.asset_number,
                    properties.title_of_plaque,
                    properties.description_of_plaque,
                    properties.tree_common_name,
                    properties.tree_scientific_name,
                    properties.date_of_tree_planted
                ];
                
                const found = searchFields.some(field => field && field.toLowerCase().includes(searchTerm));

                // Highlight matching features
                if (found) {
                    layer.setStyle({ fillColor: 'yellow' }); // Highlight color
                }
            });
        });
        
        return container;
    }
}

// Usage example (assuming geoJsonLayer is defined):
const customSearchControl = new CustomSearchControl({ layer: geoJsonLayer });
map.addControl(customSearchControl);
