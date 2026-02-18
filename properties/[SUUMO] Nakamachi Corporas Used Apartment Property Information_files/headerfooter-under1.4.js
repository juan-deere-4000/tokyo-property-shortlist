/**
 * @license Copyright (C) Recruit Co., Ltd.
 */

/**
 * [suumo すべての基幹となるsuumoオブジェクト]
 *
 * @type {[Object]}
 */
var suumo = suumo || {};

/**
 * [headerfooter suumoのヘッダーフッター用となるオブジェクト]のコピー
 * jquery1.4未満のため、delegate使用不可
 *
 * @constructor
 */
suumo.headerfooter = function() {
};

/**
 * [dispBox ボックス表示・非表示用]
 *
 * @param {[String]}
 *            options.targetBox 表示するボックス
 * @param {[String]}
 *            options.backLayer 全画面バックレイヤー指定（ID指定）
 * @param {[String]}
 *            options.closeBtn 閉じるボタン
 */
suumo.headerfooter.dispBox = function(options) {
	var $targetBox = $(options.targetBox);
	$targetBox.before('<div id="' + options.backLayer + '"></div>');
	$targetBox.show();

	var closeBtn = options.closeBtn;
	$(closeBtn + ', #' + options.backLayer).click(function() {
		$targetBox.hide();
		$('#' + options.backLayer).remove();
	});
};

/**
 * [sitecatalyst サイカタイベントタグ]
 * @param  {String} clickLabel クリックイベントID.
 * @param  {String} conversionEvent 計測したいイベントを設定、イベント計測しない場合は「None」を設定.
 * @param  {Boolean} self 自画面遷移の場合、true.
 */
suumo.headerfooter.sitecatalyst = function (clickLabel, conversionEvent, self) {
	var nowTime = new Date();
	//二重送信抑止(0.5秒以内に連続クリックされた場合、送信されない)
	if (!this.sendTime || nowTime - this.sendTime > 500) {
		s.linkTrackVars = "prop1,prop2,prop3,prop58";
		s.linkTrackEvents = conversionEvent;
		s.prop58 = clickLabel;
		if (self === true) {
			s.tl(this, "o", clickLabel, null, "navigate");
		} else {
			s.tl(this, "o", clickLabel);
		}
		this.sendTime = nowTime;
	}
};

/**
 * [scrollDom ◯◯pxスクロール時にフェードイン]
 *
 * @param {[String]}
 *            options.targetID フェードイン・アウトさせる要素
 * @param {[Number]}
 *            options.borderHeight ボーダーとなる値
 */
suumo.headerfooter.scrollDom = function(options) {
	var scroll = $(window).scrollTop();
	var $targetID = $(options.targetID);
	var display = $targetID.css('display');
	if (display === 'block') {
		if (scroll < options.borderHeight) {
			$targetID.fadeOut('500');
		}
	} else {
		if (options.borderHeight < scroll) {
			$targetID.fadeIn('500');
		}
	}
};

/**
 * [goScroll 対象となるDOMの位置までアニメーションしてスクロール]
 *
 * @param {Object} options 行き先DOM、スクロール対象、スクロール調整値.
 * suumo.headerfooter.goScroll({
 * 'targetID': '#js-areaSelectPanel', //スクロールされる先
 * 'scrollTarget': '#js-lightbox-inner', //スクロールバーのDOM
 * 'adjustVal': -50 //スクロール値の補正
 * });
 */
suumo.headerfooter.goScroll = function(options) {
	var scrollBar = options.scrollTarget || 'body, html';
	var adjustVal = options.adjustVal || 0;
	var scrollTopVal = $(options.targetID).offset().top + adjustVal;
	// ライトボックス内のスクロール対応
	if (options.lightboxFlg) {
		scrollTopVal = $(options.targetID).position().top + $(scrollBar).scrollTop() + adjustVal;
	}
	window.setTimeout(function() {
		$(scrollBar).animate({
			scrollTop: scrollTopVal
		}, 500);
	});
};

/**
 * [ajaxForm フォーム非同期通信用]
 *
 * @param {[String]}
 *            options.targetForm 送信用Form
 *            単一：指定したFormの設定で送信する
 *            複数：最初に指定したFormの設定に、後続のinput情報を付け加えて送信する
 * @param {[String]}
 *            options.targetID 非同期通信後の、レスポンス入れ替え対象
 * @param {[String]}
 *            options.action actionの強制変更用
 * @param {[String]}
 *            options.method methodの強制変更用
 * @param {[String]}
 *            options.data dataの強制変更用
 * @param {[String]}
 *            options.successFunc 成功時のfunction処理
 */
suumo.headerfooter.ajaxForm = function(options) {
	var $targetForm = $(options.targetForm);
	if ($targetForm.length === 0) {
		return;
	}

	var firstForm = options.targetForm.split(',')[0];
	$.ajax({
		type : options.method || $(firstForm).attr('method'),
		url : options.action || $(firstForm).attr('action'),
		data : options.data || $targetForm.serialize(),
		success : function(data) {
			if (options.successFunc !== undefined) {
				options.successFunc(data);
			} else {
				$(options.targetID).html(data);
			}
		}
	});
};

/**
 * [ajaxDelAnimate ajax通信後の削除＆表示アニメーション]
 * @param  {String} options.data       アニメーション後に挿入されるデータ.
 * @param  {String} options.targetID   データを挿入する要素ID.
 * @param  {String} options.animateTargetID アニメーションさせる要素ID.
 */
suumo.headerfooter.ajaxDelAnimate = function(options) {
	$(options.animateTargetID).animate({
		height: 0
	}, {
		duration: 500,
		complete: function() {
			$(options.animateTargetID).html('');
			setTimeout(function() {
				$(options.targetID).html(options.data);
			}, 750);
		}
	});
};

/**
 * [setCookie cookie再設定]
 *
 * @param {[String]}(必須パラメータ)
 *            options.name 設定したいパラメータ名
 * @param {[String]}(必須パラメータ)
 *            options.value 設定したいパラメータ値
 * @param {[Date]}(デフォルトは1年後)
 *            options.date Cookieの有効期間
 */
suumo.headerfooter.setCookie = function(options) {
	var date = options.date || new Date();
	if(options.date === undefined){
		date.setFullYear(date.getFullYear() + 1);
	}
	document.cookie = options.name + '=' + options.value + ';path=/ ;expires=' + date.toGMTString() + ';';
};

/**
 * [noticeCnt マイリストカウントアップ時のアニメーション]
 *
 * @param {[String]}(必須パラメータ)
 *            options.targetID アニメーションさせたい対象
 * @param {[String]}(必須パラメータ)
 *            options.value 設定したいパラメータ値
 */
suumo.headerfooter.noticeCnt = function(options) {
	var $targetID = $(options.targetID);
	var $anmBox = $('<span>' + options.value + '</span>');
	var sizeOrgProp, sizeLargeProp;
	sizeOrgProp = {
		w: $targetID.width() * 2,
		h: $targetID.height()
	};
	sizeLargeProp = {
		w: $targetID.width() * 4,
		h: $targetID.height() * 1.3
	};
	$anmBox.css({
		opacity: 1,
		position: 'absolute',
		top: '50%',
		left: '50%',
		display: 'block',
		width: sizeOrgProp.w,
		height: sizeOrgProp.h,
		marginTop: sizeOrgProp.h / 2 * -1,
		marginLeft: sizeOrgProp.w / 2 * -1,
		color: '#ffffff',
		textAlign: 'center'
	});
	$targetID.css('position', 'relative').append($anmBox);
	$anmBox.animate({
		opacity: 0,
		width: sizeLargeProp.w,
		height: sizeLargeProp.h,
		marginTop: sizeLargeProp.h / 1.75 * -1,
		marginLeft: sizeLargeProp.w / 2 * -1,
		fontSize: 27
	}, 300, function(){
		$targetID.html(options.value);
	});
};

/**
 * ヘッダカウント処理
 *   クッキー値の更新
 *   アニメーション
 *
 * @param {[String]}(必須パラメータ)
 *            更新後の値のID
 * @param {[String]}(必須パラメータ)
 *            ヘッダのカウンタのID
 * @param {[String]}(必須パラメータ)
 *            クッキーの名前
 * @param {[String]}(必須パラメータ)
 *            クッキー値のID
 */
suumo.headerfooter.updateHeaderMylistCnt = function(popCntId, headCntId, cookieName, cookieValueId) {
	if ($(popCntId)[0] === undefined ) {return;}
	suumo.headerfooter.noticeCnt({
		'targetID': headCntId,
		'value': $(popCntId).text()
	});
	suumo.headerfooter.setCookie({
		'name' : cookieName,
		'value' : $(cookieValueId).text()
	});
};

/**
 * controller
 */
// SUUMOロゴ
var $win = $(window);
$win.scroll(function() {
	suumo.headerfooter.scrollDom({
		'targetID' : '#js-mylist-logo',
		'borderHeight' : 100
	});
});

// ページの先頭へ戻る
$win.scroll(function() {
	suumo.headerfooter.scrollDom({
		'targetID' : '#js-pageTop',
		'borderHeight' : 400
	});
});
$('#js-pageTop').click(function() {
	suumo.headerfooter.goScroll({
		'targetID' : 'body'
	});
});

//物件マイリスト件数をcookieに保存
if ($('#js-mylistbukkencountcookie')[0] !== undefined ){
	suumo.headerfooter.setCookie({
		'name' : 'mylist_bukken_cnt',
		'value' : $('#js-mylistbukkencountcookie').text()
	});
	$('#js-mylistbukkencountcookie').remove();
}
//会社マイリスト件数をcookieに保存
if ($('#js-mylistkaishacountcookie')[0] !== undefined ){
	suumo.headerfooter.setCookie({
		'name' : 'mylist_kaisha_cnt',
		'value' : $('#js-mylistkaishacountcookie').text()
	});
	$('#js-mylistkaishacountcookie').remove();
}
//保存した検索条件マイリスト件数をcookieに保存
if ($('#js-mylistkensakujokencountcookie')[0] !== undefined ){
	suumo.headerfooter.setCookie({
		'name' : 'mylist_sch_cnt',
		'value' : $('#js-mylistkensakujokencountcookie').text()
	});
	$('#js-mylistkensakujokencountcookie').remove();
}

// 閲覧履歴一覧
$('#js-mylist-myHistory').click(function() {
	// 内容初期化
	$('#js-poplistSearch, #js-poplistBukken').html('データを読み込み中・・・');

	// ボックス制御
	suumo.headerfooter.dispBox({
		'targetBox' : '#js-mylist-historyBox',
		'backLayer' : 'js-baseBackLayer',
		'closeBtn' : '#js-mylist-historyBox-close'
	});

	// 最近見た物件・会社検索取得
	suumo.headerfooter.ajaxForm({
		'targetForm' : '#js-popLatestBukkenForm',
		'targetID' : '#js-mylist-historyBox-popLatestBukken'
	});

	// 最近検索した条件検索取得
	suumo.headerfooter.ajaxForm({
		'targetForm' : '#js-popLatestSearchForm',
		'targetID' : '#js-mylist-historyBox-popLatestSearch'
	});
});

// 閲覧履歴ボックス内の最近見た物件・会社検索
suumo.headerfooter.ajaxPopLatestBukken = function(data) {
	// ajax用のアニメーション設定
	suumo.headerfooter.ajaxDelAnimate({
		'targetID' : '#js-mylist-historyBox-popLatestBukken',
		'animateTargetID' : '#js-mylist-historyBox-popLatestBukken-animate',
		'data' : data
	});
};
$('#js-mylist-historyBox-resetLatestBukken').live('click', function() {
	// 履歴削除リンク
	suumo.headerfooter.ajaxForm({
		'targetForm' : '#js-resetLatestBukkenForm',
		'successFunc' : suumo.headerfooter.ajaxPopLatestBukken
	});
});
$(".js-browse_morelink").live("click", function () {
		// 閲覧履歴の「最近検索した条件をもっと見る」リンク
		suumo.headerfooter.sitecatalyst("search_link_historybox", "None", true);
	});
$('#js-mylist-historyBox-popLatestBukken-animate .js-submitRelLink').live('click', function() {
	// 指定箇所のRel属性用のリンクサブミット
	var targetUrl = $('#' + $(this).attr('rel')).attr('href');
	window.location.href = targetUrl;
	return false;
});

// 閲覧履歴ボックス内の最近検索した条件検索
suumo.headerfooter.ajaxPopLatestSearch = function(data) {
	// ajax用のアニメーション設定
	suumo.headerfooter.ajaxDelAnimate({
		'targetID' : '#js-mylist-historyBox-popLatestSearch',
		'animateTargetID' : '#js-mylist-historyBox-popLatestSearch-animate',
		'data' : data
	});
};
$('#js-mylist-historyBox-resetLatestSearch').live('click', function() {
	// 履歴削除リンク
	suumo.headerfooter.ajaxForm({
		'targetForm' : '#js-resetLatestSearchForm',
		'successFunc' : suumo.headerfooter.ajaxPopLatestSearch
	});
});
// 会員登録ボタン
$(".js-member-entry").live("click", function () {
	$("#js-myEntryForm").submit();
	return false;
});

// ログインボタン
$(".js-mylist-login").live("click", function () {
	$("#js-turnbackPostForm").submit();
	return false;
});

$('#js-mylist-historyBox-popLatestSearch-animate .js-submitRelLink').live('click', function() {
	// 指定箇所のRel属性用のリンクサブミット
	var targetUrl = $('#' + $(this).attr('rel')).attr('href');
	window.location.href = targetUrl;
	return false;
});

// 保存した検索条件
$('#js-mylist-myKensakuJoken').click(function() {
	$('#js-myKensakuJokenForm').submit();
});

// 全国へリンク
$('.js-setCookieArZenkoku').click(function() {
	suumo.headerfooter.setCookie({
		'name' : 'ar',
		'value' : '000'
	});
});

/**
 * PC版へ遷移するリンク PC版SUUMOではスマートフォンからアクセスがあった時にスマホ版にリダイレクトさせる機能がある。
 * よってPC版に遷移させるときに単純にPC版に遷移させるだけでは、スマホ版にリダイレクトさせる機能によりスマホ版SUUMOにリダイレクトされてしまう。
 * これを回避するためSUUMO_PC_VIEWを設定し、そのexpire_dateを設定している
 *
 */
$(document).ready(function(){
	$('#js-setCookiePcViewFR').click(function() {
		var expire_date = new Date();
		expire_date.setTime(expire_date.getTime()+86400000);
		document.cookie = 'SUUMO_PC_VIEW=0;path=/;domain=suumo.jp;expires='+expire_date.toGMTString()+ ';';
	});

	$('#js-setCookiePcView').click(function() {
		var expire_date = new Date();
		expire_date.setTime(expire_date.getTime()+86400000);
		document.cookie = 'SUUMO_PC_VIEW=0;path=/;domain=suumo.jp;expires='+expire_date.toGMTString()+ ';';
	});
});
