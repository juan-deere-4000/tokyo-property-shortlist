if ( "undefined" == typeof(SUUMO) || !SUUMO ) {
var SUUMO = {};
}

SUUMO.KR_SHOSAI_LOAN = {
	loadScripts: function(scripts, func) {
		if(scripts.length === 1) {
			$.getScript(scripts[0], func);
		} else {
			$.getScript(scripts[0], function() {
				SUUMO.KR_SHOSAI_LOAN.loadScripts(scripts.slice(1), func);
			});
		}
	},
	
	openLoanWindow: function(that) {
		sfloan_window(that, '', $('#jsiLoanAmount').val() + '/10000');
	}
};
