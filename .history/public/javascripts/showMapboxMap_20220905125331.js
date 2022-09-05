mapboxgl.accessToken = mapToken;
const coord = campground.geometry.coordinates;
const map = new mapboxgl.Map({
  container: 'map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/streets-v11',
  center: coord,
  zoom: 12,
});
const popup = new mapboxgl.Popup({ closeOnClick: false }).setHTML(
  `
  <h1>${campground.title}</h1>
  <p>${campground.location}</p>`
);

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
  .setPopup(popup)
  .setLngLat(coord)
  .addTo(map);
