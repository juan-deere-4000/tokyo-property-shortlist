	    (async function () {
	      // Hard-cutover behavior: inventory is Supabase-driven only.
	      document.querySelectorAll('.property').forEach(function (node) {
	        node.remove();
	      });
	      createEditDialog();
	      try {
	        await loadPublishedProperties();
	      } catch (err) {
	        console.error('loadPublishedProperties failed', err);
	      }
	      try {
	        await initStarsAndFilters();
	      } catch (err) {
        console.error('initStarsAndFilters failed', err);
      }
      try {
        await initNotes();
      } catch (err) {
        console.error('initNotes failed', err);
      }
      try {
        await initRatings();
      } catch (err) {
        console.error('initRatings failed', err);
      }
    })();
