//
//
//
$(function(){
	$('#recommendIchiran').mouseover(SUUMO.KR_COMMON.mouseover);
	$('#jsiPoplist').mouseover(SUUMO.KR_COMMON.mouseover);
	$('#jsiPoplist').mouseleave(SUUMO.KR_COMMON.mouseleave);
	$('#header_search_text').example(SUUMO.KR_COMMON.example);
	$('#jsiKensakuButton').click(SUUMO.KR_COMMON.submit);

	$('#jsiShowHideTxt').click(SUUMO.KR_COMMON.showHideSearchResult);
	$('.jsiToggleShikugun').live('click', SUUMO.KR_COMMON.showHideShikugun);
	$('.jsiToggleEnsen').live('click', SUUMO.KR_COMMON.showHideEnsen);
	$('#jsiToggleEnsenEki').live('click', SUUMO.KR_COMMON.showHideEnsenEki);
	$('.btnCondSearch').live('click', SUUMO.KR_COMMON.doSubmit);
});
