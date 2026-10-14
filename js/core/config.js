	    const NOTES_CONFIG = Object.assign(
	      {
	        supabaseUrl: '',
	        supabasePublishableKey: '',
	        supabaseAnonKey: '',
	        table: 'property_notes',
	        notesByAuthorTable: 'property_notes_by_author',
	        starTable: 'property_flags',
	        ratingTable: 'property_ratings',
	        vetoTable: 'property_vetoes'
	      },
	      window.NOTES_CONFIG || {}
	    );

	    const RATERS = ['Joe', 'Max', 'Michelle'];
	    const NOTE_AUTHORS = ['Joe', 'Max', 'Michelle', 'Agent'];
	    const METRICS = ['Interior', 'Neighborhood', 'Transit'];
	    const METRIC_LABELS = {
	      Interior: '🏠 Interior',
	      Neighborhood: '🌳 Neighborhood',
	      Transit: '🚇 Transit'
	    };
	    const METRIC_TOOLTIPS = {
	      Interior: 'Life inside, and everything relating to the interior of the property. How nice will it be to spend time there? How convenient and usable will it be for various sleeping configurations? Has it be recently renovated?',
	      Neighborhood: 'Life outside. How nice of a location is this property from the perspective of a walker? Low traffic? Trees? Parks? Local restaurants? Pleasant walk to the train?',
	      Transit: 'Getting to town. How good are the transit options from this property\'s home station to places in Tokyo you care about going to? How long is the walk to that station?'
	    };
	    const METRIC_UI_TO_STORAGE = {
	      Interior: 'Layout'
	    };
	    const METRIC_STORAGE_TO_UI = {
	      Layout: 'Interior'
	    };
	    const SORT_OPTIONS = ['rating', 'neighborhood_rating', 'transit_rating', 'interior_rating', 'date', 'price', 'cpsqm', 'sqm', 'walk', 'train', 'total'];
	    const UI_PREFS_STORAGE_KEY = 'tokyo_property_shortlist_ui_prefs_v1';

	    let supabaseClient;
    function initializeSupabase() {
      const key = NOTES_CONFIG.supabasePublishableKey || NOTES_CONFIG.supabaseAnonKey;
      if (!NOTES_CONFIG.supabaseUrl || !key) {
        throw new Error('Supabase configuration is missing');
      }
      if (!window.supabase) throw new Error('Supabase could not load');
      supabaseClient = window.supabase.createClient(NOTES_CONFIG.supabaseUrl, key);
    }
	    let editDialog = null;
	    let editHandlersBound = false;
