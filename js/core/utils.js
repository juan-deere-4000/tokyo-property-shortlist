	    function escapeHtml(value) {
	      return String(value == null ? '' : value)
	        .replace(/&/g, '&amp;')
	        .replace(/</g, '&lt;')
	        .replace(/>/g, '&gt;')
	        .replace(/"/g, '&quot;')
	        .replace(/'/g, '&#39;');
	    }

	    function formatTagDate(isoValue) {
	      if (!isoValue) return 'N/A';
	      const dt = new Date(isoValue);
	      if (Number.isNaN(dt.getTime())) return 'N/A';
	      return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	    }

	    function isRecentDate(isoValue) {
	      if (!isoValue) return false;
	      const dt = new Date(isoValue);
	      if (Number.isNaN(dt.getTime())) return false;
	      const age = Date.now() - dt.getTime();
	      return age >= 0 && age <= (48 * 60 * 60 * 1000);
	    }

	    function buildMapsSearchUrl(query) {
	      const q = (String(query || '').trim() || 'Tokyo');
	      return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
	    }

	    function normalizeLineName(line) {
	      const raw = String(line || '').trim();
	      if (!raw) return raw;
	      return /line$/i.test(raw) ? raw : (raw + ' Line');
	    }
	    function cleanWard(value) {
	      const raw = String(value || '').trim();
	      if (!raw) return '';
	      return raw.replace(/-ku$/i, '').trim();
	    }

	    function parseIntOrNull(value) {
	      if (value == null || String(value).trim() === '') return null;
	      const n = parseInt(String(value).trim(), 10);
	      return Number.isFinite(n) ? n : null;
	    }

	    function parseFloatOrNull(value) {
	      if (value == null || String(value).trim() === '') return null;
	      const n = Number(String(value).trim());
	      return Number.isFinite(n) ? n : null;
	    }

	    function normalizeSourceUrl(value) {
	      const raw = String(value || '').trim();
	      if (!raw) return '';
	      const stripped = raw.replace(/[\u0000-\u001F\u007F]/g, '');
	      const url = new URL(stripped, document.baseURI);
	      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
	        throw new Error('Source URL must start with https:// or http://');
	      }
	      return /^[a-z][a-z0-9+.-]*:/i.test(stripped) ? url.href : stripped;
	    }

    function safeSourceUrl(value) {
      try {
        return normalizeSourceUrl(value) || '#';
      } catch (error) {
        return '#';
      }
    }

    function propertySourceUrl(source, translated) {
      // Archived pages already live on this site and must not go through Translate.
      if (/^properties\//.test(String(source || ''))) return safeSourceUrl(source);
      const preferred = safeSourceUrl(translated);
      return preferred === '#' ? safeSourceUrl(source) : preferred;
    }

    function formatTransit(walk, train, total) {
      if (walk == null && train == null) return total == null ? 'Transit TBD' : total + ' min total';
      const parts = ['🚶 ' + (walk == null ? 'TBD' : walk + ' min'), '🚇 ' + (train == null ? 'TBD' : train + ' min')];
      if (total != null) parts.push(total + ' min');
      return parts.join(' → ');
    }
