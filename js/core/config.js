	    const NOTES_CONFIG = Object.assign(
	      {
	        supabaseUrl: '',
	        supabaseAnonKey: '',
	        table: 'property_notes',
	        notesByAuthorTable: 'property_notes_by_author',
	        starTable: 'property_flags',
	        ratingTable: 'property_ratings',
	        vetoTable: 'property_vetoes'
	      },
	      window.NOTES_CONFIG || {}
	    );

    // Fail hard if Supabase config is missing
    if (!NOTES_CONFIG.supabaseUrl || !NOTES_CONFIG.supabaseAnonKey) {
      throw new Error('Supabase config missing: supabaseUrl and supabaseAnonKey required in NOTES_CONFIG');
    }

	    const RATERS = ['Joe', 'Max', 'Michelle'];
	    const NOTE_AUTHORS = ['Joe', 'Max', 'Michelle', 'Agent'];
	    const METRICS = ['Neighborhood', 'Transit', 'Layout'];
	    const SORT_OPTIONS = ['score', 'date', 'price', 'cpsqm', 'sqm', 'walk', 'train', 'total'];
	    const UI_PREFS_STORAGE_KEY = 'tokyo_property_shortlist_ui_prefs_v1';

	    const supabaseClient = window.supabase.createClient(NOTES_CONFIG.supabaseUrl, NOTES_CONFIG.supabaseAnonKey);
	    let editDialog = null;
	    let editHandlersBound = false;
