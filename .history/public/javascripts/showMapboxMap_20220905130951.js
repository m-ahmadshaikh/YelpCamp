mapboxgl.accessToken = mapToken;
const coord = campground.geometry.coordinates;
const map = new mapboxgl.Map({
  container: 'map',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/light-v10',
  center: coord,
  zoom: 12,
});
const popup = new mapboxgl.Popup({ offset: 25, closeOnClick: false }).setHTML(
  `
  <h3>${campground.title}</h3>
  <p>${campground.location}</p>`
);

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
  .setPopup(popup)
  .setLngLat(coord)
  .addTo(map);
const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');

for (const input of inputs) {
  input.onclick = (layer) => {
    const layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);
  };
}
