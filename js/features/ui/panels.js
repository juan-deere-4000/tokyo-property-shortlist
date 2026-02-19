    function createNotesUI(card, slug) {
      const meta = card.querySelector('.meta');
      if (!meta) return null;
      const actions = ensureMetaActions(meta);

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'tag notes-toggle';
      toggle.setAttribute('data-expanded', 'false');
      toggle.textContent = 'Notes';

      actions.appendChild(toggle);

      const panel = document.createElement('div');
      panel.className = 'notes-panel collapsed';
      panel.setAttribute('aria-hidden', 'true');
      let pillsHtml = '';
      let editorsHtml = '';
      NOTE_AUTHORS.forEach(function (author) {
        pillsHtml += '<button type="button" class="notes-author-pill" data-author="' + author + '" data-active="false" data-has-content="false">' + author + '</button>';
        editorsHtml +=
          '<div class="notes-editor" data-author="' + author + '" aria-hidden="true">' +
            '<div class="notes-editor-head">' +
              '<button type="button" class="notes-author-pill notes-editor-pill" data-author="' + author + '" data-active="true">' + author + '</button>' +
            '</div>' +
            '<textarea class="notes-input" data-author="' + author + '" placeholder="Add ' + author + '\'s notes..."></textarea>' +
          '</div>';
      });
      pillsHtml += '<button type="button" class="notes-author-pill notes-sold-toggle">Sold</button>';
      pillsHtml += '<button type="button" class="notes-author-pill notes-exclusive-toggle">Exclusive</button>';
      panel.innerHTML =
        '<div class="notes-authors">' + pillsHtml + '</div>' +
        '<div class="notes-editors">' +
          editorsHtml +
        '</div>' +
        '<div class="notes-hint"></div>';
      card.appendChild(panel);

      function setExpanded(expanded) {
        toggle.setAttribute('data-expanded', expanded ? 'true' : 'false');
        toggle.textContent = 'Notes';
        panel.classList.toggle('collapsed', !expanded);
        panel.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      }

	      toggle.addEventListener('click', function () {
	        const hideNotesEl = document.getElementById('hide-notes');
	        if (hideNotesEl && hideNotesEl.checked) {
	          hideNotesEl.checked = false;
	          applyFilters();
	          setExpanded(true);
	          return;
	        }
	        setExpanded(toggle.getAttribute('data-expanded') !== 'true');
	      });

      return { slug, panel, toggle, setExpanded, card };
    }

    function createRatingsUI(card, slug) {
      const meta = card.querySelector('.meta');
      if (!meta) return null;
      const actions = ensureMetaActions(meta);

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'tag ratings-toggle';
      toggle.setAttribute('data-expanded', 'false');
      toggle.textContent = 'Ratings';

      const notesToggle = actions.querySelector('.notes-toggle');
      if (notesToggle) actions.insertBefore(toggle, notesToggle);
      else actions.appendChild(toggle);

      const panel = document.createElement('div');
      panel.className = 'ratings-panel collapsed';
      panel.setAttribute('aria-hidden', 'true');

      let html = '<table class="ratings-table"><thead><tr><th></th>';
      METRICS.forEach(function (metric) {
        html += '<th>' + (METRIC_LABELS[metric] || metric) + '</th>';
      });
      html += '<th>Veto</th>';
      html += '</tr></thead><tbody>';
      RATERS.forEach(function (rater) {
        html += '<tr><th>' + rater + '</th>';
        METRICS.forEach(function (metric) {
          html += '<td><div class="rating-control" data-rater="' + rater + '" data-metric="' + metric + '">' +
            '<input class="rating-range" type="range" min="0" max="10" step="0.1" value="0">' +
            '<span class="rating-value">—</span>' +
            '<button type="button" class="rating-clear" aria-label="Clear rating">×</button>' +
            '</div></td>';
        });
        html += '<td><button type="button" class="veto-btn" data-rater="' + rater + '">Veto</button></td>';
        html += '</tr>';
      });
      html += '</tbody></table>';
      panel.innerHTML = html;
      card.appendChild(panel);

      function setExpanded(expanded) {
        toggle.setAttribute('data-expanded', expanded ? 'true' : 'false');
        panel.classList.toggle('collapsed', !expanded);
        panel.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      }
      toggle.addEventListener('click', function () {
        setExpanded(toggle.getAttribute('data-expanded') !== 'true');
      });

      return { slug, panel, toggle, setExpanded, card };
    }
