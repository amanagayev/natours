export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoieWlsZGl6dG05IiwiYSI6ImNrcTNlaWg5ZjBydzgycnBmeWFkNjNlOWoifQ.a2-Lxvk8ic0SOETA1GxRhg';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/yildiztm9/ckq3ezkfn2qqf17p92wiqwteo',
        scrollZoom: false
        // center: [-118.549449, 34.040173],
        // zoom: 7,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';
        
        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extends map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};
