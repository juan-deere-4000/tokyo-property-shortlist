//
//
//
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

function delArCookie() {
	var date = new Date();
	date.setYear(date.getYear() - 1);
	var i = 0;
	while (-1 < document.cookie.indexOf("ar") & i++ < 10) {
		document.cookie = "ar=;path=/ ;expires=" + date.toGMTString() + ";";
	}
}

if ( "undefined" == typeof(SUUMO) || !SUUMO ) {
	var SUUMO = {};
}

COMMON.HEADER.getResetLatestList = function(ar, bs, dispmode,seino) {
	$("#poplistBukken").html("<div >データを読み込み中・・・</div >");

	$.ajax({
		type:"POST",
		url :"/jj/common/parts/JJ901FI311/",
		data: "ar="+ ar + "&bs="+ bs + "&dispmode=" + dispmode + "&seinoflg=" + seino + "&styleKbn=1",
		success: function (msg) {
			$("#poplistSearch").html( msg );
		}
	});

	$.ajax({
		type:"POST",
		url :"/jj/common/parts/JJ901FI301/",
		data: "ar="+ ar + "&bs="+ bs + "&dispmode=" + dispmode + "&styleKbn=1",
		success: function (msg) {
			$("#poplistBukken").html( msg );

		}
	});
	return false;
}
SUUMO.KR_COMMON = {
	 clickFlg : false
	,historyLoadFlg : true //履歴読み込みフラグ(backで戻った最初かどうかを判定)
	,setHistoryInfo : function(info1Id,info2Id) {
		SUUMO.KR_COMMON.historyLoadFlg = false;//履歴読み込み禁止
		$("#historyInfo1").val(info1Id + "=" +$(info1Id).html())
		$("#historyInfo2").val(info2Id + "=" +$(info2Id).html())
		if(!document.all) {
			var html = "";
			$(info1Id +" :checkbox").each(function(){
				if(html == "") {
					html += this.checked;
				} else {
					html += "||" + this.checked;
				}
			});
			$("#firefoxhistoryInfo3").val(html);
		}
		$.historyLoad(1);
	}
	,historyInit: function() {
		var historyInfo1 = $("#historyInfo1");
		var historyInfo2 = $("#historyInfo2");
		var firefoxhistoryInfo3 = $("#firefoxhistoryInfo3");
		if (historyInfo1.length && historyInfo2.length && firefoxhistoryInfo3.length) {
			$.historyInit(SUUMO.KR_COMMON.pageload);
		}
	}
    ,checkBoxIndex : 0 // CheckBoxIndex
    ,checkBoxArray : [] // 履歴
	,pageload : function(hash) {
		if(hash) {
			if(SUUMO.KR_COMMON.historyLoadFlg) {
				var info1 = $("#historyInfo1").val();
				var info2 = $("#historyInfo2").val();
				if(info1 != "" && info2 != "") {
					var index = info1.indexOf("=");
					$(info1.substring(0,index)).html(info1.substring(index+1));
					var index2 = info2.indexOf("=");
					$(info2.substring(0,index2)).html(info2.substring(index2+1));
					if(!document.all) {
						var info3 = $("#firefoxhistoryInfo3").val();
						var info3Arr = info3.split("||");
						SUUMO.KR_COMMON.checkBoxArray = info3Arr;
						SUUMO.KR_COMMON.checkBoxIndex = 0;
                        $(info1.substring(0,index) +" :checkbox").each(function(){
                            if ("true" == SUUMO.KR_COMMON.checkBoxArray[SUUMO.KR_COMMON.checkBoxIndex])
                            {
                                this.checked = SUUMO.KR_COMMON.checkBoxArray[SUUMO.KR_COMMON.checkBoxIndex];
                            }
                            SUUMO.KR_COMMON.checkBoxIndex++;
                        });
					}
				}
			}
		}
	}

	,executeLoadHTML: function(type, url, formId, targetId, strParameter) {
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
			error: function(msg) {
				$('#' + targetId).hide();
			}
		});
	}

	,mouseover: function(event) {
		var target = $(event.target);//イベント発生オブジェクトを取得
		var id = target.attr('id');
		if(id == 'recommendIchiran') {
			$('#jsiPoplist').show();
			$('#jsiPoplist').css({
				display: 'block',
				cursor: 'pointer'
			});
			$('#recommendIchiran').css({
				backgroundPosition: '-981px -48px'
			});
			$('#jsiListInner').show();
			$('#jsiListInner').css({
				cursor: 'default'
			});
		} else if (id == 'jsiPoplist') {
			$('#recommendIchiran').css({
				backgroundPosition: '-981px -48px'
			});
		} else {
			$('#recommendIchiran').css({
				backgroundPosition: '-981px -32px'
			});
		}
	}

	,mouseleave : function(event) {
		$('#jsiPoplist').hide();
		$('#nav_function .btListHistory').css({
			backgroundPosition: '-981px -32px'
		});
	}

	,isClicked : function() {
		var clickFlg = SUUMO.KR_COMMON.clickFlg;
		SUUMO.KR_COMMON.clickFlg = true;
		return clickFlg;
	}
	, resetClicked : function() {
		SUUMO.KR_COMMON.clickFlg = false;
	}

	,example : function() {
		return  $(this).attr('title');
	}

	,submit : function() {
		var header_search_text = $('#header_search_text');
		if( header_search_text.attr('title') == header_search_text.val() && header_search_text.attr('class').match(/example/) ) {
			header_search_text.val('');
		}
		$('#wordSearch').submit();
		return false;
	}
	
	,showHideShikugun : function() {
		var jsiToggleShikugunTxt = $('#jsiToggleShikugunTxt');
		var jsiToggleShikugun = $('.jsiToggleShikugun');
		var jsiToggleShikugun1 = $('#jsiToggleShikugun1');
		var jsiDispClass = $('#jsiDispClass');
		if (jsiToggleShikugunTxt.hasClass("dn")) {
			jsiToggleShikugunTxt.removeClass('dn');
			jsiToggleShikugunTxt.show();
			jsiToggleShikugun.text('市区郡を閉じる');
			jsiDispClass.val('');
			jsiToggleShikugun1.removeClass('dn');
		} else {
			jsiToggleShikugunTxt.addClass('dn');
			jsiToggleShikugunTxt.hide();
			jsiToggleShikugun.text('市区郡を選択する');
			jsiDispClass.val('dn');
			jsiToggleShikugun1.addClass('dn');
		}
	}

	,showHideEnsen : function() {
		var jsiToggleEnsenTxt = $('#jsiToggleEnsenTxt');
		var jsiToggleEnsen = $('.jsiToggleEnsen');
		var jsiToggleEnsen1 = $('#jsiToggleEnsen1');
		var jsiDispClass = $('#jsiDispClass');
		if (jsiToggleEnsenTxt.hasClass("dn")) {
			jsiToggleEnsenTxt.removeClass('dn');
			jsiToggleEnsenTxt.show();
			jsiToggleEnsen.text('沿線を閉じる');
			jsiDispClass.val('');
			jsiToggleEnsen1.removeClass('dn');
		} else {
			jsiToggleEnsenTxt.addClass('dn');
			jsiToggleEnsenTxt.hide();
			jsiToggleEnsen.text('沿線を選択する');
			jsiDispClass.val('dn');
			jsiToggleEnsen1.addClass('dn');
		}
	}
	
	,showHideEnsenEki : function() {
		var jsiToggleEnsenEkiTxt = $('#jsiToggleEnsenEkiTxt');
		var jsiToggleEnsenEki = $('#jsiToggleEnsenEki');
		var jsiDispClass = $('#jsiDispClass');
		if (jsiToggleEnsenEkiTxt.hasClass("dn")) {
			jsiToggleEnsenEkiTxt.removeClass('dn');
			jsiToggleEnsenEkiTxt.show();
			jsiToggleEnsenEki.text('元に戻す');
			jsiDispClass.val('');
		} else {
			jsiToggleEnsenEkiTxt.addClass('dn');
			jsiToggleEnsenEkiTxt.hide();
			jsiToggleEnsenEki.text('沿線の駅を全て表示する');
			jsiDispClass.val('dn');
		}
	}
	
	,doSubmit : function() {
		var form = $('#bukkenKensakuAjaxId'),
		Kbn = $('#jsiKbn').val(), 
		disabledClass = $('#jsiDisabledClass').val(),
		tudofukenCd = $('#jsiTudofukenCd'),
		shikugunCd = $('#jsiToggleShikugunList'),
		ensenCd = $('#jsiToggleEnsenList'),
		rnekCd = $('#jsiRnekCd');
		
		if (disabledClass == "true") {
			return false;
		}
		
		if (Kbn == "9") {
			if (tudofukenCd.val() == null || tudofukenCd.val() == ''){
			    tudofukenCd.attr('disabled', 'disabled');
			}
		} 
		else if (Kbn == "10") {
			if (shikugunCd.val() == null || shikugunCd.val() == ''){
				shikugunCd.attr('disabled', 'disabled');
			}
			if (ensenCd.val() == null || ensenCd.val() == ''){
				ensenCd.attr('disabled', 'disabled');
			}
		}
		else if (Kbn == "12") {
			if (rnekCd.val() == null || rnekCd.val() == ''){
				rnekCd.attr('disabled', 'disabled');
			}
		}

		form.attr('action', SUUMO.KR_COMMON_CONFIG.ctx + '/bukken/ichiran/JJ012FC001');
		form.submit();
	}

	,showHideSearchResult : function() {
		var $sResult = $('#sResult');
		if ($(this).text() == '検索条件を非表示にする') {
			$(this).addClass('icoCondOpen');
			$(this).removeClass('icoCondClose');
			$(this).text('検索条件を表示する');
			$sResult.hide();
		} else {
			$(this).addClass('icoCondClose');
			$(this).removeClass('icoCondOpen');
			$(this).text('検索条件を非表示にする');
			$sResult.show();
		}
		return false;
	}
	
	,clickJokenButton : function() {
		//一覧画面の「条件を変更する」ボタン/条件ライトボックスの「条件をリセット」ボタン
		if(SUUMO.KR_COMMON.isClicked()) {
			return false;
		}
		
		$('#rnThickboxId').empty();
		var lightBoxParam = $('#jsiLightBoxParam');
		var url = SUUMO.KR_COMMON_CONFIG.ctx + '/bukken/common/JJ010FK001/lightboxJoken/';
		var imgUrl=  SUUMO.KR_COMMON_CONFIG.ctx + '/jjcommon/img/map/spinner2.gif';
		var jj010fk0114_jsp = $('#jj010fk0114_jsp');
		jj010fk0114_jsp.empty();
		var html = '<div style=\"position:absolute;z-index:8;\"><img src=\"'+imgUrl+'\" style=\"margin: 180px 300px 0pt;z-index:8;border:0;padding:0\"/></div>'
		jj010fk0114_jsp.html(html);

		$.ajax({
			type: "POST",
			url: url,
			data: lightBoxParam.val(),
			success: function(msg){
				SUUMO.KR_COMMON.resetClicked();
				jj010fk0114_jsp.html(msg);
			},
			error: function(err) {
				SUUMO.KR_COMMON.resetClicked();
				alert("error");
			}
		});
	}
	
	,clickAreaButton : function() {
		//一覧画面の「エリアを選択する」ボタン/エリアライトボックスの「条件をリセット」するボタン
		if(SUUMO.KR_COMMON.isClicked()) {
			return false;
		}

		$('#jj010fk0114_jsp').empty();
		var lightBoxParam = $('#jsiLightBoxParam');
		var url = SUUMO.KR_COMMON_CONFIG.ctx + '/bukken/common/JJ010FK001/lightboxArea/';
		var imgUrl=  SUUMO.KR_COMMON_CONFIG.ctx + '/jjcommon/img/map/spinner2.gif';
		var rnThickboxId = $('#rnThickboxId');
		rnThickboxId.empty();
		var html = '<div style=\"position:absolute;z-index:8;\"><img src=\"'+imgUrl+'\" style=\"margin: 180px 300px 0pt;z-index:8;border:0;padding:0\"/></div>'
		rnThickboxId.html(html);

		$.ajax({
			type: "POST",
			url: url,
			data: lightBoxParam.val(),
			success: function(msg){
				SUUMO.KR_COMMON.resetClicked();
				rnThickboxId.html(msg);
			},
			error: function(err) {
				SUUMO.KR_COMMON.resetClicked();
				alert("error");
			}
		});
	}
	
	,clickEnsenButton : function() {
		//一覧画面の「沿線を選択する」ボタン/沿線ライトボックスの「条件をリセット」するボタン
		if(SUUMO.KR_COMMON.isClicked()) {
			return false;
		}
		
		$('#jj010fk0114_jsp').empty();
		var lightBoxParam = $('#jsiLightBoxParam');
		var url = SUUMO.KR_COMMON_CONFIG.ctx + '/bukken/common/JJ010FK001/lightboxEnsen/';
		var imgUrl=  SUUMO.KR_COMMON_CONFIG.ctx + '/jjcommon/img/map/spinner2.gif';
		var rnThickboxId = $('#rnThickboxId');
		rnThickboxId.empty();
		var html = '<div style=\"position:absolute;z-index:8;\"><img src=\"'+imgUrl+'\" style=\"margin: 180px 300px 0pt;z-index:8;border:0;padding:0\"/></div>'
		rnThickboxId.html(html);

		var data = lightBoxParam.val();
		if(data.indexOf("rn=") == -1) {
			data = data.replace(/rnTemp=/g, "rn=");
		}

		$.ajax({
			type: "POST",
			url: url,
			data: data,
			success: function(msg){
				SUUMO.KR_COMMON.resetClicked();
				rnThickboxId.html(msg);
			},
			error: function(err) {
				SUUMO.KR_COMMON.resetClicked();
				alert("error");
			}
		});
	}
	
	,clickEkiButton : function() {
		//一覧画面の「駅を選択する」ボタン/駅ライトボックスの「条件をリセットする」ボタン
		if(SUUMO.KR_COMMON.isClicked()) {
			return false;
		}
		
		$('#jj010fk0114_jsp').empty();
		var lightBoxParam = $('#jsiLightBoxParam');
		var url = SUUMO.KR_COMMON_CONFIG.ctx + '/bukken/common/JJ010FK001/lightboxEki/';
		var imgUrl=  SUUMO.KR_COMMON_CONFIG.ctx + '/jjcommon/img/map/spinner2.gif';
		var rnThickboxId = $('#rnThickboxId');
		rnThickboxId.empty();
		var html = '<div style=\"position:absolute;z-index:8;\"><img src=\"'+imgUrl+'\" style=\"margin: 180px 300px 0pt;z-index:8;border:0;padding:0\"/></div>'
		rnThickboxId.html(html);

		var data = lightBoxParam.val();
		if(data.indexOf("rn=") == -1) {
			data = data.replace(/rnTemp=/g, "rn=");
		}

		$.ajax({
			type: "POST",
			url: url,
			data: data,
			success: function(msg){
				SUUMO.KR_COMMON.resetClicked();
				rnThickboxId.html(msg);
			},
			error: function(err) {
				SUUMO.KR_COMMON.resetClicked();
				alert("error");
			}
		})
	}
}

//ビーコン送信メソッド
var WkWkFirstViewSendFlgYoyakuCalendar = 0;
var pgId = $('#jsiPageId').val();
var _WkWkParams = _WkWkParams || [];
_WkWkParams.push(['TEMPLATE_ID', 'PC_SUUMO']);
_WkWkParams.push(['PAGE_ID', pgId]);
_WkWkParams.push(['NO_TPV']);

function checkLogsuumoYoyakuCalendar(event) {
	var existsFlg = setInterval(function() {
		if (typeof(WkWkTracker) === 'function') {
			clearInterval(existsFlg);
			executeWkWkTrackerYoyakuCalendar(event);
		}
	}, 100);
}
function executeWkWkTrackerYoyakuCalendar(event) {
	if (typeof(WkWkTracker) !== 'function') {
		checkLogsuumoYoyakuCalendar(event);
		return false;
	}

	var bukkenCd = $('#jsiBukkenCd').val();
	var projectCd = $('#jsiProjectCd').val();
	if($('.js-cta_button').hasClass('is-immediate')){
		var parameter = [ ['eventName', 'imp_sokuji_calendar'],['bc', bukkenCd],['nc', projectCd],['yoyaku_kbn', '1']]
	}else{
		var parameter = [ ['eventName', 'imp_sokuji_calendar'],['bc', bukkenCd],['nc', projectCd],['yoyaku_kbn', '2'] ]
	}
	WkWkTracker.trackEvent(event, parameter);
	WkWkFirstViewSendFlgYoyakuCalendar = 1;
}

$(window).load(function(event) {
	var timer = setInterval(function() {
		var calendar = 'js-calendar_container';
		var carousel = 'js-carousel_content';
		var calendarElements = document.getElementsByClassName(calendar);
		var carouselElements = document.getElementsByClassName(carousel);
		if((calendarElements.length > 0) && (carouselElements.length > 0)){
			if(!$('.js-calendar_container').hasClass('is-inactive') && !$('.js-carousel_content').hasClass('is-loading')){
				if (WkWkFirstViewSendFlgYoyakuCalendar ===0) {
					executeWkWkTrackerYoyakuCalendar(event);
					clearInterval(timer);
				}
			}
		}
	},1000);
})