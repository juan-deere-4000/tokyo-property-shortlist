$(function(){
	var loadLoanLib = false;
	$('#jsiLoanWindow, #jsiLoanWindow2').click(function(){
		var that = $(this).get(0);
		if(!loadLoanLib) {
			SUUMO.KR_SHOSAI_LOAN.loadScripts(
					['/jj/jjcommon/js/loan/sfloan.js',
			         '/jj/jjcommon/js/loan/sfkapmd.js',
			         '/jj/jjcommon/js/loan/cookieprm.js',
			         '/jj/krcommon/js/loan/krdetailpanel.js'
			         ],
			         function(){
						SUUMO.KR_SHOSAI_LOAN.openLoanWindow(that);
					 });
		} else {
			SUUMO.KR_SHOSAI_LOAN.openLoanWindow(that);
		}
		loadLoanLib = true
		return false;
	});
});
