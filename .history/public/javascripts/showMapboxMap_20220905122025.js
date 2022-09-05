mapboxgl.accessToken = mapToken;
console.log(JSON.parse(campground);
const map = new mapboxgl.Map({
  container: 'map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [72.699409621, 32.781784668],
  zoom: 8,
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
  .setLngLat([72.699409621, 32.781784668])
  .addTo(map);
