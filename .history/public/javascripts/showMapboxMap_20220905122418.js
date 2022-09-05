mapboxgl.accessToken = mapToken;
const coord = campground.geometry.coordinates;
const map = new mapboxgl.Map({
  container: 'map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/streets-v11',
  center: coord,
  zoom: 8,
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker().setLngLat(coord).addTo(map);
