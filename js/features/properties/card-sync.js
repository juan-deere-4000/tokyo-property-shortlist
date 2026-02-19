	    function updateCardDOM(externalId, payload) {
	      const card = Array.from(document.querySelectorAll('.property')).find(function (node) {
	        return node.getAttribute('data-external-id') === externalId;
	      });
	      if (!card) return;
	      const link = card.querySelector('.property-link');
	      const jp = card.querySelector('.jp-subtitle-link');
	      const price = card.querySelector('.price');
	      const stationLink = card.querySelector('.station-link');
	      const stationLine = card.querySelector('.station-line');
	      const transit = card.querySelector('.transit-pills');
	      const layoutTag = card.querySelector('.layout-tag');
	      const sqmTag = card.querySelector('.sqm-tag');
	      const cpSqmTag = card.querySelector('.cpsqm-tag');
	      const wardTag = card.querySelector('.tag.ward');

	      if (link && payload.title_en != null) link.textContent = payload.title_en || '';
	      if (jp && payload.title_ja != null) jp.textContent = payload.title_ja || '';
	      const titleEn = payload.title_en != null ? payload.title_en : (link ? link.textContent : '');
	      const titleJa = payload.title_ja != null ? payload.title_ja : (jp ? jp.textContent : '');
	      if (payload.source_url) {
	        if (link) link.href = payload.source_url;
	      }
	      if (price && payload.price_m != null && Number.isFinite(Number(payload.price_m))) {
	        const p = Number(payload.price_m);
	        price.textContent = '¥' + p.toFixed(1) + 'M';
	        card.dataset.price = String(p);
	      }
	      const stationNameValue = payload.station_name != null ? payload.station_name : (stationLink ? stationLink.textContent : '');
	      if (stationLink && payload.station_name != null) stationLink.textContent = payload.station_name || '';
	      if (stationLink) stationLink.href = buildMapsSearchUrl((stationNameValue || '') + ' Tokyo');
	      if (jp) jp.href = buildMapsSearchUrl(titleJa || titleEn || '');
	      if (stationLine && payload.station_line != null) stationLine.textContent = normalizeLineName(payload.station_line || '');
	      if (layoutTag && payload.layout != null) layoutTag.textContent = payload.layout || 'TBD';
	      let sqmForCalc = Number.NaN;
	      if (sqmTag) {
	        const sqm = Number(payload.sqm);
	        sqmTag.textContent = Number.isFinite(sqm) ? (sqm.toFixed(2).replace(/\\.00$/, '') + 'm²') : 'TBD';
	        if (Number.isFinite(sqm)) card.dataset.sqm = String(sqm);
	        sqmForCalc = sqm;
	      }
	      if (cpSqmTag) {
	        const priceM = Number(payload.price_m);
	        if (!Number.isFinite(sqmForCalc)) sqmForCalc = Number(card.dataset.sqm);
	        if (Number.isFinite(priceM) && Number.isFinite(sqmForCalc) && sqmForCalc > 0) {
	          const cpSqmK = Math.round((priceM * 1000) / sqmForCalc);
	          cpSqmTag.textContent = '¥' + cpSqmK.toLocaleString('en-US') + 'k/m²';
	          card.dataset.cpsqm = String(cpSqmK);
	        } else {
	          cpSqmTag.textContent = 'TBD';
	          delete card.dataset.cpsqm;
	        }
	      }
	      if (wardTag && payload.ward != null) {
	        const ward = cleanWard(payload.ward) || 'Unknown';
	        wardTag.textContent = ward + '-ku';
	      }
	      const walk = Number(payload.walk_min);
	      const train = Number(payload.train_min);
	      const total = Number(payload.total_transit_min);
	      if (transit) {
	        if (Number.isFinite(walk) && Number.isFinite(train) && Number.isFinite(total)) {
	          transit.textContent = '🚶 ' + walk + ' min → 🚇 ' + train + ' min → ' + total + ' min';
	          card.dataset.walk = String(walk);
	          card.dataset.train = String(train);
	          card.dataset.total = String(total);
	        } else {
	          transit.textContent = 'Transit TBD';
	        }
	      }
	      sortCards();
	      applyFilters();
	    }
