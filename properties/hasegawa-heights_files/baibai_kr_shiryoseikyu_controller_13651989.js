$(function(){

	// 入力画面
	$('#jsiTelToFax').click(SUUMO.KR_SHIRYOSEIKYU.faxCheck);
	var inputInquiryCash = $('#jsiInquiry :input');
	inputInquiryCash.click(SUUMO.KR_SHIRYOSEIKYU.inquiryCheck);
	inputInquiryCash.blur(SUUMO.KR_SHIRYOSEIKYU.inquiryCheck);
	$('#jsDspProfile').click(SUUMO.KR_SHIRYOSEIKYU.postActionProfile);
	$('#jsDspProfile01').click(SUUMO.KR_SHIRYOSEIKYU.postActionProfile);
	$('#jsDspKakunin, #jsDspKakunin1, #jsDspKakunin2').click(SUUMO.KR_SHIRYOSEIKYU.postActionKakunin);
	$('#jsDspBack').click(SUUMO.KR_SHIRYOSEIKYU.postActionBack);
	$('#jsiZipSearchClient').click(SUUMO.KR_SHIRYOSEIKYU.zipSearch);
	// 確認画面
	$('#jsDspKanryo').click(SUUMO.KR_SHIRYOSEIKYU.postActionKanryo);
	$('#jsDspKanryoKyodakuAri').click(function(){
		flgBeforeUnload = false;
		$('#jsiKrCusKarteFlg').val('1');
		$('#jsiKrCusKarteVer').val('1');
		$('#jsiKrCusKarteModalFlg').val('1');
		SUUMO.KR_SHIRYOSEIKYU.postActionKanryo();
	});
	$('#jsDspKanryoKyodakuNashi').click(function(){
		flgBeforeUnload = false;
		$('#jsiKrCusKarteFlg').val('0');
		$('#jsiKrCusKarteVer').val('1');
		$('#jsiKrCusKarteModalFlg').val('1');
		SUUMO.KR_SHIRYOSEIKYU.postActionKanryo();
	});
	$('#jsDspKanryoKyodakuAriNew').click(function(){
		flgBeforeUnload = false;
		$('#jsiKrCusKarteFlg').val('1');
		$('#jsiKrCusKarteVer').val('2');
		$('#jsiKrCusKarteModalFlg').val('1');
		SUUMO.KR_SHIRYOSEIKYU.postActionKanryo();
	});
	$('#jsDspKanryoKyodakuNashiNew').click(function(){
		flgBeforeUnload = false;
		$('#jsiKrCusKarteFlg').val('0');
		$('#jsiKrCusKarteVer').val('2');
		$('#jsiKrCusKarteModalFlg').val('1');
		SUUMO.KR_SHIRYOSEIKYU.postActionKanryo();
	});
	$('#jsDspShuseiToNyuryoku').click(SUUMO.KR_SHIRYOSEIKYU.postActionNyuryoku);
	$('#jsDspShuseiToNyuryoku01').click(SUUMO.KR_SHIRYOSEIKYU.postActionNyuryoku);
	$('#jsDspModoruToNyuryoku').click(SUUMO.KR_SHIRYOSEIKYU.postActionNyuryoku);
	$('#jsDspKanryoGo').click(SUUMO.KR_SHIRYOSEIKYU.postActionKanryo);
	$('#jsDspModoruToNyuryokuGo').click(SUUMO.KR_SHIRYOSEIKYU.postActionNyuryoku);
	$('#jsDspKanryoGoTop').click(SUUMO.KR_SHIRYOSEIKYU.postActionKanryo);
	$('#jsDspModoruToNyuryokuGoTop').click(SUUMO.KR_SHIRYOSEIKYU.postActionNyuryoku);
	// 完了画面
	$('#jsDspCondoNewTop').click(SUUMO.KR_SHIRYOSEIKYU.postActionTop);
	$('#jsDspCondoUsedTop').click(SUUMO.KR_SHIRYOSEIKYU.postActionTop);
	$('#jsDspDetachedNewTop').click(SUUMO.KR_SHIRYOSEIKYU.postActionTop);
	$('#jsDspDetachedUsedTop').click(SUUMO.KR_SHIRYOSEIKYU.postActionTop);
	$('#jsDspDetachedLandTop').click(SUUMO.KR_SHIRYOSEIKYU.postActionTop);
	$('#jsDspShosai').click(SUUMO.KR_SHIRYOSEIKYU.postActionShosai);
	$('#jsDspKaiinToroku').click(SUUMO.KR_SHIRYOSEIKYU.postActionKaiinToroku);
	$('#jsDspKaiinKoshin').click(SUUMO.KR_SHIRYOSEIKYU.postActionKaiinKoshin);

	if (document.getElementById("KR_COMPLETE_FORM_RECOMMEND_DIV_001") != null) {
		SUUMO.KR_COMMON.executeLoadHTML("POST", "/jj/common/parts/krCompleteFormRecommend01/", null, "KR_COMPLETE_FORM_RECOMMEND_DIV_001", $('#jsiKrFormRecommend01Parameter').val());
	}

	if (document.getElementById("KR_CONFIRM_FORM_RECOMMEND_DIV_001") != null) {
		SUUMO.KR_COMMON.executeLoadHTML("POST", "/jj/common/parts/krConfirmFormRecommend01/", null, "KR_CONFIRM_FORM_RECOMMEND_DIV_001", $('#jsiKrConfirmFormRecommend01Parameter').val());
	}

	if (document.getElementById("KR_INPUT_FORM_RECOMMEND_DIV_001") != null) {
		SUUMO.KR_COMMON.executeLoadHTML("POST", "/jj/common/parts/krInputFormRecommend01/", null, "KR_INPUT_FORM_RECOMMEND_DIV_001", $('#jsiKrInputFormRecommend01Parameter').val());
	}
});
