// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have the required data
    if (!mapToken || !listing.geometry?.coordinates) {
        console.error('Missing required map data');
        return;
    }

    mapboxgl.accessToken = mapToken;

    try {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: listing.geometry.coordinates,
            zoom: 9
        });

        // Add marker only after map is loaded
        map.on('load', () => {
            new mapboxgl.Marker()
                .setLngLat(listing.geometry.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 })
                        .setHTML(
                            `<h4>${listing.location}</h4><p>Exact location provided after booking</p>`
                        )
                )
                .addTo(map);
        });
    } catch (error) {
        console.error('Error initializing map:', error);
    }
});

