var _map = null;
var _markers = {};  // external_id → Leaflet marker

function initMap() {
  var el = document.getElementById('property-map');
  if (!el) return;
  _map = L.map('property-map').setView([35.68, 139.69], 12);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri',
    maxZoom: 20
  }).addTo(_map);
  document.addEventListener('filtersChanged', syncMapMarkers);
  renderMapMarkers();
}

function placeMarker(slug, card) {
  // Remove stale marker for this slug if it exists
  if (_markers[slug]) {
    _map.removeLayer(_markers[slug]);
    delete _markers[slug];
  }
  var lat = parseFloat(card.dataset.lat);
  var lng = parseFloat(card.dataset.lng);
  if (isNaN(lat) || isNaN(lng)) return;

  var title = '';
  var a = card.querySelector('.property-header h2 a');
  if (a) title = a.textContent || '';

  var marker = L.marker([lat, lng]).addTo(_map);
  marker.bindTooltip(title, { permanent: false });
  marker.on('click', function () {
    document.querySelectorAll('.property.map-highlight').forEach(function (c) {
      c.classList.remove('map-highlight');
    });
    card.classList.add('map-highlight');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () { card.classList.remove('map-highlight'); }, 2000);
  });
  _markers[slug] = marker;
}

function renderMapMarkers() {
  if (!_map) return;
  document.querySelectorAll('.property').forEach(function (card) {
    var slug = card.getAttribute('data-external-id');
    if (!slug) return;
    if (_markers[slug]) return;  // already placed, not a coordinate update
    placeMarker(slug, card);
  });
}

// Called after a coordinate edit to reposition a single pin
function refreshMarker(slug) {
  if (!_map) return;
  var card = document.querySelector('[data-external-id="' + slug + '"]');
  if (!card) return;
  placeMarker(slug, card);
  syncMapMarkers();
}

function syncMapMarkers() {
  if (!_map) return;
  document.querySelectorAll('.property').forEach(function (card) {
    var slug = card.getAttribute('data-external-id');
    var marker = _markers[slug];
    if (!marker) return;
    var visible = card.style.display !== 'none';
    if (visible && !_map.hasLayer(marker)) marker.addTo(_map);
    if (!visible && _map.hasLayer(marker))  _map.removeLayer(marker);
  });
}
