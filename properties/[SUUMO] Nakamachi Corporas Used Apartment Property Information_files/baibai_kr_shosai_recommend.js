var $win = $(window);
var recommendGetFlg = 0;

//初期表示
$win.load(function() {
	if (recommendGetFlg !==1) {
		var endTabTop = parseInt($('#KR_SHOSAI_RECOMMEND_DISP_DIV_001').offset().top);
		var winTop = $win.scrollTop();
		var winHeight = $win.height();
		if ((winTop + winHeight) >= endTabTop) {
			recommendGetFlg = 1;
			if ($('#KR_SHOSAI_RECOMMEND_DIV_001') != null) {
				executeLoadHTML("POST", "/jj/common/parts/krShosaiRecommend01/", null, "KR_SHOSAI_RECOMMEND_DIV_001", $('#jsiKrShosaiRecommend01Parameter').val());
			}
		}
	}
});
//スクロール
$win.scroll(function(event) {
	if (recommendGetFlg !==1) {
		var endTabTop = parseInt($('#KR_SHOSAI_RECOMMEND_DISP_DIV_001').offset().top);
		var winTop = $win.scrollTop();
		var winHeight = $win.height();
		if ((winTop + winHeight) >= endTabTop) {
			recommendGetFlg = 1;
			if ($('#KR_SHOSAI_RECOMMEND_DIV_001')  != null) {
				executeLoadHTML("POST", "/jj/common/parts/krShosaiRecommend01/", null, "KR_SHOSAI_RECOMMEND_DIV_001", $('#jsiKrShosaiRecommend01Parameter').val());
			}
		}
	}
});

function executeLoadHTML(type, url, formId, targetId, strParameter) {
	if (url == undefined) {
		return;
	}
	var strData = "";
	if (formId != null && formId != "") {
		strData =  $('#' + formId).serialize();
	} else {
		strData = (strParameter == null) ? "" : strParameter;
	}
	$.ajax({
		type: type,
		url: url,
		data: strData,
		success: function(data, dataType){
			if (data != null && data != "") {
				$('#' + targetId).html(data);
			} else {
				$('#' + targetId).hide();
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$('#' + targetId).hide();
		}
	});
}