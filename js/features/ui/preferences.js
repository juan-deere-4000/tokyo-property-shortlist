	    function loadUiPrefs() {
	      const defaults = {
	        sort_key: 'rating',
	        hide_unstarred: false,
	        hide_sold: true,
	        hide_vetoed: false,
	        hide_notes: false
	      };
	      try {
	        const raw = localStorage.getItem(UI_PREFS_STORAGE_KEY);
	        if (!raw) return defaults;
	        const parsed = JSON.parse(raw);
	        const rawSortKey = typeof parsed.sort_key === 'string' ? parsed.sort_key : defaults.sort_key;
	        const sortKey = rawSortKey === 'score' ? 'rating' : rawSortKey;
	        return {
	          sort_key: SORT_OPTIONS.includes(sortKey) ? sortKey : defaults.sort_key,
	          hide_unstarred: Boolean(parsed.hide_unstarred),
	          hide_sold: parsed.hide_sold !== false, // default true
	          hide_vetoed: Boolean(parsed.hide_vetoed),
	          hide_notes: Boolean(parsed.hide_notes)
	        };
	      } catch (err) {
	        return defaults;
	      }
	    }

	    function saveUiPrefs(patch) {
	      const next = { ...loadUiPrefs(), ...(patch || {}) };
	      try {
	        localStorage.setItem(UI_PREFS_STORAGE_KEY, JSON.stringify(next));
	      } catch (err) {
	        // Ignore (e.g. disabled storage); UI still works in-memory.
	      }
	      return next;
	    }

	    function getPropertySlug(card, idx) {
	      const externalId = card.getAttribute('data-external-id');
	      if (externalId) return externalId.replace(/[^a-zA-Z0-9_-]/g, '_');
	      const link = card.querySelector('.property-header h2 a');
	      const href = link ? (link.getAttribute('href') || '') : '';
	      const m = href.match(/properties\/([^/.]+)\.html/i);
      if (m) return m[1];
      const text = (link ? link.textContent : '').toLowerCase();
      if (text.includes('kikugawa')) return 'kikugawa-royal-corp';
      return 'property-' + idx;
    }

    function ensureMetaActions(meta) {
      let actions = meta.querySelector('.meta-actions');
      if (!actions) {
        actions = document.createElement('span');
        actions.className = 'meta-actions';
        meta.appendChild(actions);
      }
      return actions;
    }
