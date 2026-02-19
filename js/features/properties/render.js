	    function renderPropertyCards(rows) {
	      const footer = document.querySelector('.footer');
	      if (!footer || !footer.parentNode) return;

	      document.querySelectorAll('.property').forEach(function (node) {
	        node.remove();
	      });

	      rows.forEach(function (row, idx) {
	        const priceNum = row.price_m == null ? null : Number(row.price_m);
	        const sqmNum = row.sqm == null ? null : Number(row.sqm);
	        const price = row.price_m == null ? 'TBD' : Number(row.price_m).toFixed(1);
	        const walk = row.walk_min == null ? null : Number(row.walk_min);
	        const train = row.train_min == null ? null : Number(row.train_min);
	        const total = row.total_transit_min == null ? null : Number(row.total_transit_min);
	        const transitText = walk != null && train != null && total != null
	          ? ('🚶 ' + walk + ' min → 🚇 ' + train + ' min → ' + total + ' min')
	          : 'Transit TBD';
	        const sqmText = row.sqm == null ? 'TBD' : (Number(row.sqm).toFixed(2).replace(/\\.00$/, '') + 'm²');
	        const costPerSqmText = Number.isFinite(priceNum) && Number.isFinite(sqmNum) && sqmNum > 0
	          ? ('¥' + Math.round((priceNum * 1000) / sqmNum).toLocaleString('en-US') + 'k/m²')
	          : 'TBD';
	        const layoutText = row.layout || 'TBD';
	        const wardText = row.ward || 'Unknown';
	        const titleEn = row.title_en || ('Property ' + (idx + 1));
	        const titleJa = row.title_ja || '';
	        const stationName = row.station_name || (wardText + ' area');
	        const stationLineRaw = row.station_line || (row.source ? String(row.source).toUpperCase() : 'SOURCE');
	        const stationLine = normalizeLineName(stationLineRaw);
	        const link = row.source_url || '#';
	        const stationMapsUrl = buildMapsSearchUrl(stationName + ' Tokyo');
	        const jpMapsUrl = buildMapsSearchUrl(titleJa || titleEn);
	        const tagDate = formatTagDate(row.created_at);
	        const recentDateClass = isRecentDate(row.created_at) ? ' recent' : '';
	        const createdTs = Date.parse(row.created_at || '');

	        const card = document.createElement('div');
	        card.className = 'property';
	        card.setAttribute('data-external-id', row.external_id || ('row-' + idx));
	        if (Number.isFinite(priceNum)) card.dataset.price = String(priceNum);
	        if (Number.isFinite(sqmNum)) card.dataset.sqm = String(sqmNum);
	        if (Number.isFinite(priceNum) && Number.isFinite(sqmNum) && sqmNum > 0) {
	          card.dataset.cpsqm = String(Math.round((priceNum * 1000) / sqmNum));
	        }
	        if (Number.isFinite(createdTs)) card.dataset.date = String(createdTs);

	        card.innerHTML =
	          '<div class=\"property-header\">' +
	            '<span class=\"rank\">#' + (idx + 1) + '</span>' +
	            '<h2><a class=\"property-link\" href=\"' + escapeHtml(link) + '\" target=\"_blank\">' + escapeHtml(titleEn) + '</a>' +
	              '<span class=\"jp-subtitle-row\"><a class=\"jp-subtitle jp-subtitle-link\" href=\"' + escapeHtml(jpMapsUrl) + '\" target=\"_blank\">' + escapeHtml(titleJa) + '</a>' +
	              '<button type=\"button\" class=\"edit-btn\" aria-label=\"Edit property\" data-external-id=\"' + escapeHtml(row.external_id || '') + '\">&#9998;</button></span></h2>' +
	            '<span class=\"price\">¥' + escapeHtml(price) + 'M</span>' +
	          '</div>' +
	          '<div class=\"station-card\">' +
	            '<div class=\"station-main\">' +
	              '<span class=\"station-icon\">🚉</span>' +
	              '<span class=\"station-name\">' +
	                '<a class=\"station-link\" href=\"' + escapeHtml(stationMapsUrl) + '\" target=\"_blank\">' + escapeHtml(stationName) + '</a>' +
	                '<span class=\"station-line\">' + escapeHtml(stationLine) + '</span>' +
	              '</span>' +
	            '</div>' +
	            '<div class=\"station-badges\">' +
	              '<span class=\"transit-pills\">' + escapeHtml(transitText) + '</span>' +
	            '</div>' +
	          '</div>' +
	          '<div class=\"meta\">' +
	            '<span class=\"tag layout-tag\">' + escapeHtml(layoutText) + '</span>' +
	            '<span class=\"tag sqm-tag\">' + escapeHtml(sqmText) + '</span>' +
	            '<span class=\"tag cpsqm-tag\">' + escapeHtml(costPerSqmText) + '</span>' +
	            '<span class=\"tag ward\">' + escapeHtml(wardText) + '-ku</span>' +
	            '<span class=\"tag date' + recentDateClass + '\">' + escapeHtml(tagDate) + '</span>' +
	          '</div>';

	        footer.parentNode.insertBefore(card, footer);
	      });
	    }

	    async function loadPublishedProperties() {
	      const { data, error } = await supabaseClient
	        .from('properties')
	        .select('external_id,source,source_url,title_ja,title_en,ward,layout,sqm,price_m,walk_min,train_min,total_transit_min,station_name,station_line,created_at,status')
	        .eq('status', 'published')
	        .order('total_transit_min', { ascending: true, nullsFirst: false })
	        .order('price_m', { ascending: true, nullsFirst: false });
	      if (error) throw error;
	      renderPropertyCards(data || []);
	    }
