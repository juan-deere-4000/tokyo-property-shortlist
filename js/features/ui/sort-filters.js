	    function sortCards() {
	      const sortEl = document.getElementById('sort-by');
	      if (!sortEl) return;
	      const sortKey = sortEl.value || 'rating';
	      saveUiPrefs({ sort_key: sortKey });

      const cards = Array.from(document.querySelectorAll('.property'));
      const footer = document.querySelector('.footer');
      if (!footer) return;

      const dir = sortKey === 'price' || sortKey === 'cpsqm' || sortKey === 'walk' || sortKey === 'train' || sortKey === 'total'
        ? 1
        : -1;
      cards.sort(function (a, b) {
        const av = metricValue(a, sortKey);
        const bv = metricValue(b, sortKey);
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av === bv) return 0;
        return av < bv ? -1 * dir : 1 * dir;
      });

      cards.forEach(function (card) {
        footer.parentNode.insertBefore(card, footer);
      });
      updateRanks();
    }

    function updateAggregateForCard(card, slug, ratingsStore) {
      const wrap = card.querySelector('.price-wrap');
      if (!wrap) return;
      const badge = wrap.querySelector('.aggregate-score');
      if (!badge) return;
      let subheader = wrap.querySelector('.metric-subheader');
      if (!subheader) {
        subheader = document.createElement('div');
        subheader.className = 'metric-subheader';
        wrap.appendChild(subheader);
      }
      const values = [];
      const metricAverages = {};
      RATERS.forEach(function (rater) {
        METRICS.forEach(function (metric) {
          const v = ratingsStore[ratingKey(slug, rater, metric)];
          if (typeof v === 'number' && Number.isFinite(v)) values.push(v);
        });
      });
      METRICS.forEach(function (metric) {
        const metricValues = [];
        RATERS.forEach(function (rater) {
          const v = ratingsStore[ratingKey(slug, rater, metric)];
          if (typeof v === 'number' && Number.isFinite(v)) metricValues.push(v);
        });
        metricAverages[metric] = metricValues.length
          ? (metricValues.reduce(function (a, b) { return a + b; }, 0) / metricValues.length)
          : null;
      });
      const metricParts = [];
      if (metricAverages.Neighborhood != null) metricParts.push('🌳 ' + metricAverages.Neighborhood.toFixed(1));
      if (metricAverages.Transit != null) metricParts.push('🚇 ' + metricAverages.Transit.toFixed(1));
      if (metricAverages.Interior != null) metricParts.push('🏠 ' + metricAverages.Interior.toFixed(1));
      if (!values.length) {
        badge.style.display = 'none';
        badge.textContent = '';
        subheader.style.display = metricParts.length ? '' : 'none';
        subheader.textContent = metricParts.join(' · ');
        delete card.dataset.rating;
        delete card.dataset.neighborhood_rating;
        delete card.dataset.transit_rating;
        delete card.dataset.interior_rating;
        return;
      }
      const avg = values.reduce(function (a, b) { return a + b; }, 0) / values.length;
      badge.style.display = '';
      badge.textContent = avg.toFixed(1);
      subheader.style.display = metricParts.length ? '' : 'none';
      subheader.textContent = metricParts.join(' · ');
      if (metricAverages.Neighborhood != null) card.dataset.neighborhood_rating = metricAverages.Neighborhood.toFixed(2);
      else delete card.dataset.neighborhood_rating;
      if (metricAverages.Transit != null) card.dataset.transit_rating = metricAverages.Transit.toFixed(2);
      else delete card.dataset.transit_rating;
      if (metricAverages.Interior != null) card.dataset.interior_rating = metricAverages.Interior.toFixed(2);
      else delete card.dataset.interior_rating;
      card.dataset.rating = avg.toFixed(2);
    }

	    function updateVetoPill(card, slug, vetoStore) {
      const meta = card.querySelector('.meta');
      if (!meta) return;
      const hasVeto = RATERS.some(function (rater) {
        return Boolean(vetoStore[vetoKey(slug, rater)]);
      });
      card.setAttribute('data-vetoed', hasVeto ? 'true' : 'false');
      let pill = meta.querySelector('.veto-pill');
      if (!hasVeto) {
        if (pill) pill.remove();
        return;
      }
      if (!pill) {
        pill = document.createElement('span');
        pill.className = 'tag veto-pill';
        pill.textContent = 'Vetoed';
      }
      const soldTag = Array.from(meta.querySelectorAll('.tag')).find(function (tag) {
        return (tag.textContent || '').trim().toLowerCase() === 'sold';
      });
      const actions = meta.querySelector('.meta-actions');
      if (soldTag && soldTag.parentNode === meta) {
        if (soldTag.nextSibling !== pill) {
          meta.insertBefore(pill, soldTag.nextSibling);
        }
      } else if (actions && actions.parentNode === meta) {
        meta.insertBefore(pill, actions);
      } else {
        meta.appendChild(pill);
      }
	    }

	    function applyFilters() {
	      const hideUnstarredEl = document.getElementById('hide-unstarred');
	      const hideSoldEl = document.getElementById('hide-sold');
      const hideVetoedEl = document.getElementById('hide-vetoed');
      const hideNotesEl = document.getElementById('hide-notes');
      if (!hideUnstarredEl || !hideSoldEl || !hideVetoedEl || !hideNotesEl) return;
      const hideUnstarred = hideUnstarredEl.checked;
      const hideSold = hideSoldEl.checked;
      const hideVetoed = hideVetoedEl.checked;
      const hideNotes = hideNotesEl.checked;
      document.querySelectorAll('.property').forEach(function (card) {
        const starred = card.getAttribute('data-starred') === 'true';
        const sold = card.getAttribute('data-sold') === 'true';
        const vetoed = card.getAttribute('data-vetoed') === 'true';
	        const show = (!hideUnstarred || starred) && (!hideSold || !sold) && (!hideVetoed || !vetoed);
	        card.style.display = show ? '' : 'none';
	      });
	      document.querySelectorAll('.property .notes-toggle').forEach(function (btn) {
	        btn.setAttribute('aria-disabled', hideNotes ? 'true' : 'false');
	      });
	      document.body.classList.toggle('notes-hidden', hideNotes);
	      updateRanks();
	      saveUiPrefs({ hide_unstarred: hideUnstarred, hide_sold: hideSold, hide_vetoed: hideVetoed, hide_notes: hideNotes });
	    }
