const locations = JSON.parse(document.getElementById('map').dataset.locations)
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9oaXRrdW1hcjEwIiwiYSI6ImNrMDE0cHdrbDFsOGEzbG8xbTZqOHhha2sifQ.3z9SmgA2o77z4aIR4knCRA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rohitkumar10/ck8fxjpm93duw1invz6tsrw9l'
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    // Add marker
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);
    // Extend map bound to extend current location
    bounds.extend(loc.coordinates)
})

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});