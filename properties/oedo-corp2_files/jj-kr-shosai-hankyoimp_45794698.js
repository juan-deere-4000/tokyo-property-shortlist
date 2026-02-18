/**
 * @license Copyright (C) Recruit Co., Ltd.
 */
var suumo = suumo || {};

//ビーコン送信メソッド
var _WkWkParams = _WkWkParams || [];
var pageId = $('#jsiPageId').val();
_WkWkParams.push(['TEMPLATE_ID', 'PC_SUUMO']);
_WkWkParams.push(['PAGE_ID', pageId]);
_WkWkParams.push(['NO_TPV']);

//ビーコン送信メソッド
function checkLogsuumoShuyaku(event) {
	var existsFlg = setInterval(function() {
		if (typeof(WkWkTracker) === 'function') {
			clearInterval(existsFlg);
			executeWkWkTrackerShuyaku(event);
		}
	}, 100);
};

function executeWkWkTrackerShuyaku(event) {
	if (typeof(WkWkTracker) !== 'function') {
		checkLogsuumoShuyaku(event);
		return false;
	}

	var ncStr =  $('#jsiNc').val();
	var nc = ncStr.substring(1,ncStr.length - 1);
	var parameter = [['eventName', 'imp_hankyo_head'],['nc',nc],['bs', $('#jsiBs').val()]];
	WkWkTracker.trackEvent(event, parameter);
	WkWkFirstViewSendFlg = 1;
};


function trackShuyaku(event) {
	if (WkWkFirstViewSendFlg ===0) {
		var shiroseikyuTop = parseInt($('.ksShiroseikyuTit').offset().top);
		var shiroseikyuHeight = parseInt($('.ksShiroseikyuTit').height());
		var windowTop = parseInt($(window).scrollTop());
		var windowHeight = parseInt($(window).height());
		if (windowTop <= (shiroseikyuTop + shiroseikyuHeight) && shiroseikyuTop <= (windowTop + windowHeight)) {
			executeWkWkTrackerShuyaku(event);
		}
	}
};

//二重送信フラグ
var WkWkFirstViewSendFlg = 0;

var $win = $(window);
// 初期表示ビーコン送信
$win.load(function(event) {
	trackShuyaku(event);
});
//スクロールイベントごとビーコン送信
$win.scroll(function(event) {
	trackShuyaku(event);
});