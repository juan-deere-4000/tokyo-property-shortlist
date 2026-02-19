	    function escapeHtml(value) {
	      return String(value || '')
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
	      return (Date.now() - dt.getTime()) <= (48 * 60 * 60 * 1000);
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
	      try {
	        return encodeURI(stripped);
	      } catch (err) {
	        return stripped.replace(/\s+/g, '%20');
	      }
	    }
