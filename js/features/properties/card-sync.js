function updateCardDOM(externalId, payload) {
  const card = Array.from(document.querySelectorAll('.property')).find(function (node) {
    return node.dataset.externalId === externalId;
  });
  if (!card) return;
  const link = card.querySelector('.property-link');
  const jp = card.querySelector('.jp-subtitle-link');
  const stationLink = card.querySelector('.station-link');
  const price = parseFloatOrNull(payload.price_m);
  const sqm = parseFloatOrNull(payload.sqm);
  const walk = parseFloatOrNull(payload.walk_min);
  const train = parseFloatOrNull(payload.train_min);
  const total = parseFloatOrNull(payload.total_transit_min);
  const titleEn = payload.title_en || '';
  const titleJa = payload.title_ja || '';

  link.textContent = titleEn;
  link.href = propertySourceUrl(payload.source_url, payload.source_url_translated);
  jp.textContent = titleJa;
  jp.href = buildMapsSearchUrl(titleJa || titleEn);
  stationLink.textContent = payload.station_name || '';
  stationLink.href = buildMapsSearchUrl((payload.station_name || '') + ' Tokyo');
  card.querySelector('.station-line').textContent = normalizeLineName(payload.station_line);
  card.querySelector('.price').textContent = price == null ? 'TBD' : '¥' + price.toFixed(1) + 'M';
  card.querySelector('.layout-tag').textContent = payload.layout || 'TBD';
  card.querySelector('.sqm-tag').textContent = sqm == null ? 'TBD' : sqm.toFixed(2).replace(/\.00$/, '') + 'm²';
  card.querySelector('.tag.ward').textContent = (cleanWard(payload.ward) || 'Unknown') + '-ku';

  const cpsqm = price != null && sqm != null && sqm > 0 ? Math.round(price * 1000 / sqm) : null;
  card.querySelector('.cpsqm-tag').textContent = cpsqm == null ? 'TBD' : '¥' + cpsqm.toLocaleString('en-US') + 'k/m²';
  card.querySelector('.transit-pills').textContent = formatTransit(walk, train, total);

  for (const [key, value] of Object.entries({ price, sqm, cpsqm, walk, train, total })) {
    if (value == null) delete card.dataset[key];
    else card.dataset[key] = String(value);
  }
  sortCards();
  applyFilters();
}
