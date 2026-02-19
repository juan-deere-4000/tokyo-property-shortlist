    function formatPrices() {
      document.querySelectorAll('.price').forEach(function (el) {
        const m = (el.textContent || '').match(/¥\s*([0-9]+(?:\.[0-9]+)?)\s*M/i);
        if (!m) return;
        const value = Number(m[1]);
        if (!Number.isFinite(value)) return;
        el.textContent = '¥' + value.toFixed(1) + 'M';
      });
    }

    function isSoldCard(card) {
      return Array.from(card.querySelectorAll('.meta .tag')).some(function (tag) {
        return (tag.textContent || '').trim().toLowerCase() === 'sold';
      });
    }

    function parseCardMetrics(card) {
      const priceText = (card.querySelector('.price')?.textContent || '').trim();
      const priceMatch = priceText.match(/([0-9]+(?:\.[0-9]+)?)\s*M/i);
      if (priceMatch) card.dataset.price = String(Number(priceMatch[1]));

      const sqmTag = card.querySelector('.meta .sqm-tag');
      const sqmMatch = (sqmTag?.textContent || '').match(/([0-9]+(?:\.[0-9]+)?)\s*m²/i);
      if (sqmMatch) card.dataset.sqm = String(Number(sqmMatch[1]));

      const cpSqmTag = card.querySelector('.meta .cpsqm-tag');
      const cpSqmText = (cpSqmTag?.textContent || '').trim();
      const cpSqmKMatch = cpSqmText.match(/([0-9][0-9,]*(?:\.[0-9]+)?)\s*k\/m²/i);
      const cpSqmMMatch = cpSqmText.match(/([0-9]+(?:\.[0-9]+)?)\s*M\/m²/i);
      if (cpSqmKMatch) {
        card.dataset.cpsqm = String(Number(String(cpSqmKMatch[1]).replace(/,/g, '')));
      } else if (cpSqmMMatch) {
        card.dataset.cpsqm = String(Number(cpSqmMMatch[1]) * 1000);
      }

      const transitText = card.querySelector('.transit-pills')?.textContent || '';
      const minutes = Array.from(transitText.matchAll(/([0-9]+)\s*min/gi)).map(function (m) {
        return Number(m[1]);
      });
      if (minutes.length >= 3) {
        card.dataset.walk = String(minutes[0]);
        card.dataset.train = String(minutes[1]);
        card.dataset.total = String(minutes[2]);
      }
    }

    function updateRanks() {
      let n = 0;
	      document.querySelectorAll('.property').forEach(function (card) {
        const rankEl = card.querySelector('.rank');
        if (!rankEl) return;
        if (card.style.display === 'none') {
          rankEl.textContent = '';
          return;
        }
        n += 1;
        rankEl.textContent = '#' + n;
      });
    }

    function metricValue(card, key) {
      const raw = card.dataset[key];
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    }

    function ratingKey(slug, rater, metric) {
      return slug + '||' + rater + '||' + metric;
    }

    function vetoKey(slug, rater) {
      return slug + '||' + rater;
    }
