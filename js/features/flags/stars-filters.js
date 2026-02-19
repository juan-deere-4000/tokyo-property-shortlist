	    async function initStarsAndFilters() {
	      formatPrices();
	      const uiPrefs = loadUiPrefs();

	      const starredSet = new Set();
	      const soldSet = new Set();
      const exclusiveSet = new Set();

      const cards = Array.from(document.querySelectorAll('.property'));
      const slugs = cards.map(function (card, idx) {
        return getPropertySlug(card, idx + 1);
      });

      // Load stars from Supabase
      try {
	        const { data } = await supabaseClient
	          .from(NOTES_CONFIG.starTable)
          .select('property_slug, starred, sold, exclusive')
	          .in('property_slug', slugs);
	        (data || []).forEach(function (row) {
	          if (row.starred) starredSet.add(row.property_slug);
	          else starredSet.delete(row.property_slug);
	          if (row.sold) soldSet.add(row.property_slug);
	          else soldSet.delete(row.property_slug);
          if (row.exclusive) exclusiveSet.add(row.property_slug);
          else exclusiveSet.delete(row.property_slug);
	        });
      } catch (err) {
        console.error('Failed to load stars from Supabase', err);
      }

      // Load vetoes from Supabase
      const vetoStore = {};
      try {
        const { data } = await supabaseClient
          .from(NOTES_CONFIG.vetoTable)
          .select('property_slug, rater, vetoed')
          .in('property_slug', slugs);
        (data || []).forEach(function (row) {
          vetoStore[vetoKey(row.property_slug, row.rater)] = row.vetoed;
        });
      } catch (err) {
        console.error('Failed to load vetoes from Supabase', err);
      }

      cards.forEach(function (card, idx) {
	        const slug = getPropertySlug(card, idx + 1);
	        card.setAttribute('data-property-slug', slug);
	        const soldActive = soldSet.has(slug) || isSoldCard(card);
	        card.setAttribute('data-sold', soldActive ? 'true' : 'false');
        card.setAttribute('data-exclusive', exclusiveSet.has(slug) ? 'true' : 'false');
	        card.setAttribute('data-vetoed', card.getAttribute('data-vetoed') || 'false');
        parseCardMetrics(card);

        const header = card.querySelector('.property-header');
        const price = card.querySelector('.price');
        if (!header || !price) return;

        let wrap = header.querySelector('.price-wrap');
        if (!wrap) {
          wrap = document.createElement('div');
          wrap.className = 'price-wrap';
          header.insertBefore(wrap, price);
          wrap.appendChild(price);
        }
        let main = wrap.querySelector('.price-main');
        if (!main) {
          main = document.createElement('span');
          main.className = 'price-main';
          // Ensure score+price can wrap independently, while star stays outside.
          wrap.insertBefore(main, price);
          main.appendChild(price);
        }
        let aggregate = wrap.querySelector('.aggregate-score');
        if (!aggregate) {
          aggregate = document.createElement('span');
          aggregate.className = 'aggregate-score';
          aggregate.style.display = 'none';
          main.insertBefore(aggregate, price);
        }

        const star = document.createElement('button');
        star.type = 'button';
        star.className = 'star-toggle';
        star.setAttribute('aria-label', 'Toggle star');
        const active = starredSet.has(slug);
        star.classList.toggle('active', active);
        star.textContent = active ? '★' : '☆';
        card.setAttribute('data-starred', active ? 'true' : 'false');

        star.addEventListener('click', function () {
          const isActive = star.classList.toggle('active');
          star.textContent = isActive ? '★' : '☆';
          card.setAttribute('data-starred', isActive ? 'true' : 'false');
          if (isActive) starredSet.add(slug); else starredSet.delete(slug);

          // Save to Supabase
          (async function () {
            try {
              await supabaseClient
                .from(NOTES_CONFIG.starTable)
                .upsert(
                  { property_slug: slug, starred: isActive, updated_at: new Date().toISOString() },
                  { onConflict: 'property_slug' }
                );
            } catch (err) {
              console.error('Star save failed for', slug, err);
            }
          })();

          applyFilters();
        });

        // Place star next to the title (not next to the price).
        const title = card.querySelector('.property-header h2');
        const titleLink = title ? title.querySelector('a') : null;
        let titleRow = title ? title.querySelector('.title-row') : null;
        if (title && titleLink && !titleRow) {
          titleRow = document.createElement('span');
          titleRow.className = 'title-row';
          title.insertBefore(titleRow, titleLink);
          titleRow.appendChild(titleLink);
        }
        if (titleRow) titleRow.appendChild(star);
        else wrap.appendChild(star);
      });

      const hideToggle = document.getElementById('hide-toggle');
      const hideMenu = document.getElementById('hide-menu');
	      const hideUnstarredEl = document.getElementById('hide-unstarred');
	      const hideSoldEl = document.getElementById('hide-sold');
	      const hideVetoedEl = document.getElementById('hide-vetoed');
	      const hideNotesEl = document.getElementById('hide-notes');
	      const sortEl = document.getElementById('sort-by');
	      if (hideUnstarredEl) hideUnstarredEl.checked = uiPrefs.hide_unstarred;
	      if (hideSoldEl) hideSoldEl.checked = uiPrefs.hide_sold;
	      if (hideVetoedEl) hideVetoedEl.checked = uiPrefs.hide_vetoed;
	      if (hideNotesEl) hideNotesEl.checked = uiPrefs.hide_notes;
	      if (sortEl) sortEl.value = uiPrefs.sort_key;
	      if (hideUnstarredEl) hideUnstarredEl.addEventListener('change', applyFilters);
	      if (hideSoldEl) hideSoldEl.addEventListener('change', applyFilters);
	      if (hideVetoedEl) hideVetoedEl.addEventListener('change', applyFilters);
	      if (hideNotesEl) hideNotesEl.addEventListener('change', applyFilters);
	      if (sortEl) sortEl.addEventListener('change', sortCards);
      if (hideToggle && hideMenu) {
        hideToggle.addEventListener('click', function (e) {
          e.stopPropagation();
          const open = hideMenu.classList.toggle('open');
          hideToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        hideMenu.addEventListener('click', function (e) {
          e.stopPropagation();
        });
        document.addEventListener('click', function () {
          hideMenu.classList.remove('open');
          hideToggle.setAttribute('aria-expanded', 'false');
        });
      }

      sortCards();
      applyFilters();
    }
