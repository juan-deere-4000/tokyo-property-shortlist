$(function(){

	$(document).keydown(SUUMO.KR_SHOSAI_COMMON.keydown);

	$('a.jscNyroModal, a.jscNyroModal1').click(SUUMO.KR_SHOSAI_COMMON.krNyroModal);

	$("#jsiInfoMikata").click(function(){
		SUUMO.KR_SHOSAI_COMMON.popUp($('#jsiInfoMikataUrl').val(),780,800);
	});

	$("a.jscPrintWindow").click(function(){
		SUUMO.KR_SHOSAI_COMMON.popUp($('input.jscPrintWindowUrl').val(),800,600);
	});

	$("a.jscChizuMiru").click(function(){
		SUUMO.KR_SHOSAI_COMMON.popUp($('input.jscChizuMiruUrl').val(),800,600);
	});

	$("#jsiStreetView").click(function(){
		SUUMO.KR_SHOSAI_COMMON.popUp($('#jsiStreetViewUrl').val(),900,640);
	});

	$("a.jscKeisaiAyamari").click(function(){
		SUUMO.KR_SHOSAI_COMMON.popUp($('input.jscKeisaiAyamari').val(), 800, 600);
	});

	$("a.jscNorikaePop").click(function(){
		SUUMO.KR_SHOSAI_COMMON.norikaePop($('input.jscNorikaePopForm').val());
	});

	$("#jsiNorikaePop1").click(function(){
		SUUMO.KR_SHOSAI_COMMON.norikaePop("norikaePop1Form");
	});

	$("#jsiNorikaePop2").click(function(){
		SUUMO.KR_SHOSAI_COMMON.norikaePop("norikaePop2Form");
	});

	$("#jsiNorikaePop3").click(function(){
		SUUMO.KR_SHOSAI_COMMON.norikaePop("norikaePop3Form");
	});

	$("#jsiNorikaePop4").click(function(){
		SUUMO.KR_SHOSAI_COMMON.norikaePop("norikaePop4Form");
	});

	$("#jsiNorikaePop5").click(function(){
		SUUMO.KR_SHOSAI_COMMON.norikaePop("norikaePop5Form");
	});

	$("#jsiNorikaePop6").click(function(){
		SUUMO.KR_SHOSAI_COMMON.norikaePop("norikaePop6Form");
	});

	$("a.jscToiawaseSakiWindow").click(function(){
		SUUMO.KR_SHOSAI_COMMON.toiawaseNewWindow($('input.jscToiawaseSakiWindowUrl').val());
	});

	$('a.jscBlank').click(SUUMO.KR_SHOSAI_COMMON.openNewWindow);

	$('a.jscOpenWindow').click(SUUMO.KR_SHOSAI_COMMON.openSubWindow);

	$('a.jscClose').click(SUUMO.KR_SHOSAI_COMMON.closeWindow);

	$('a.jscKrPrint').click(SUUMO.KR_SHOSAI_COMMON.krPrint);
	//不動産会社ガイド
	$("a.jscFrontLogClickLink").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLink($('#jsiFudosanGaidoLogLinkType').val());
	});
	//関連リンク
	$("#jsiFrontLogClickLinkEx1").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLinkEx($('#jsiKanrenLogLinkType1').val(), $('#jsiKanrenLogLinkKey1').val());
	});
	$("#jsiFrontLogClickLinkEx2").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLinkEx($('#jsiKanrenLogLinkType2').val(), $('#jsiKanrenLogLinkKey2').val());
	});
	$("#jsiFrontLogClickLinkEx3").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLinkEx($('#jsiKanrenLogLinkType3').val(), $('#jsiKanrenLogLinkKey3').val());
	});
	$("#jsiFrontLogClickLinkEx4").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLinkEx($('#jsiKanrenLogLinkType4').val(), $('#jsiKanrenLogLinkKey4').val());
	});
	$("#jsiFrontLogClickLinkEx5").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLinkEx($('#jsiKanrenLogLinkType5').val(), $('#jsiKanrenLogLinkKey5').val());
	});
	//建物参考事例
	$("a.jscFrontTatemonoLogClickLink").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLinkEx($('#jsiTatemonoLogLinkType').val(), $('#jsiTatemonoLogLinkKey').val());
	});
	//クチコミ
	$("a.jscFrontKuchikomiLogClickLink").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLink($('#jsiKuchikomiLogLinkType').val());
	});
	// 資料請求
	$('a.jscBukkenshiryou').click(SUUMO.KR_SHOSAI_COMMON.bukkenshiryou);
	// 来場予約
	$('a.jscRaijoyoyaku').click(SUUMO.KR_SHOSAI_COMMON.raijoyoyaku);
	//マイリストに追加する
	$('a.btnAddMylist').click(function(){
		if ($(this).hasClass('is-inactive')) {
			SUUMO.KR_SHOSAI_COMMON.deleteClipSingle($('input.jscContextRoot').val());
		} else {
			SUUMO.KR_SHOSAI_COMMON.registClip($('input.jscContextRoot').val());
			var rtLogBs = $('#shosaiBsStr').val();
			if('011'== rtLogBs ||'020'== rtLogBs ||'021'== rtLogBs ||'030'== rtLogBs ){
				//<%-- キネシスパラメーター設定(PC：TE) start --%>
				//<![CDATA[
				SuumoPageData.rtLog = {};
				SuumoPageData.rtLog.action_type = 'TE';
				SuumoPageData.rtLog.template_id = 'PC_SUUMO';
				SuumoPageData.rtLog.service_shubetsu_cd = rtLogBs;
				SuumoPageData.rtLog.eventName = 'mylist';
				SuumoPageData.rtLog.nc =$('#jsiProjectCd').val();
				rtLogTracker.trackEvent();
				//]]>
				//<%-- キネシスパラメーター設定(PC：TE) end --%>
			}
		}
	});

	//価格更新お知らせメール
	$("#updatePrice").click(SUUMO.KR_SHOSAI_COMMON.registClipMailSingle);

	//店舗タブ・掲載中の物件一覧リンク
	$("#jsiFrontLogClickLinkMsNew").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLink($('#jsiFrontLogClickLinkMsNewType').val());
	});
	$("#jsiFrontLogClickLinkMsUsed").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLink($('#jsiFrontLogClickLinkMsUsedType').val());
	});
	$("#jsiFrontLogClickLinkKodateNew").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLink($('#jsiFrontLogClickLinkKodateNewType').val());
	});
	$("#jsiFrontLogClickLinkKodateUsed").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLink($('#jsiFrontLogClickLinkKodateUsedType').val());
	});
	$("#jsiFrontLogClickLinkLand").click(function(){
		SUUMO.KR_SHOSAI_COMMON.frontLogClickLink($('#jsiFrontLogClickLinkLandType').val());
	});
	//併記電話番号画面表示
	$("a.heikiToiawaseWindow").click(function(){
		SUUMO.KR_SHOSAI_COMMON.heikiNewWindow($('input.heikiToiawaseWindowUrl').val(),700,600);
	});
	$("a.heikiToiawaseWindowKaisha").click(function(){
		SUUMO.KR_SHOSAI_COMMON.heikiNewWindow($('input.heikiToiawaseWindowKaishaUrl').val(),700,600);
	});
});
