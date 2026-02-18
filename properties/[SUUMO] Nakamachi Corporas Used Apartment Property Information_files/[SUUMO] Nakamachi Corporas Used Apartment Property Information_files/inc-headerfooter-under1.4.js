/**
 * @license Copyright (C) Recruit Co., Ltd.
 */

/**
 * [suumo すべての基幹となるsuumoオブジェクト]
 *
 * @type {Object}
 */
var suumo = suumo || {};

/**
 * [inc jQuery1.4未満差込用オブジェクト]
 * @constructor
 * @todo jQuery1.4未満のため、delegate使用不可
 */
suumo.inc = function() {};

/**
 * [isEmptyInput インプット欄が空かどうか]
 * @param {String} targetID インプット欄ID.
 * @return {Boolean} 空の場合はfalse.
 */
suumo.inc.isEmptyInput = function(targetID) {
	var $searchText = $(targetID);
	var val = $searchText.attr('value');
	var defaultVal = $searchText.attr('placeholder');
	if (val === defaultVal || val === '') {
		return true;
	} else {
		return false;
	}
};

/**
 * [heightLine 対象となるDOMの高さを揃える関数]
 * @param  {String} opt_target 高さを揃えたい要素のクラス.
 * HTMLには判別しやすいよう class="js-heightline"を挿入済みです.
 */
suumo.inc.heightLine = function(opt_target) {
	var max = 0, height;
	$(opt_target)
	.each(function() {
		height = $(this).height();
		if (height > max) {
			max = height;
		}
	})
	.height(max);
};

/**
 * [placeholderEvent プレースフォルダー制御]
 *
 * @param {Object} options 対象DOM設定.
 * @example
 * suumo.inc.placeholderEvent({
 *     // targetID トリガーとなるチェックボックス.
 *     targetID: '#js-keywordSearchText'
 * });
 */
suumo.inc.placeholderEvent = function(options) {
	if ('placeholder' in document.createElement('input')) {
		// 自己定義関数で上書きする
		// placeholderがサポートされているので処理は不要
		suumo.inc.placeholderEvent = function() {};
		return false;
	}
	// 自己定義関数で必要処理を上書きする
	suumo.inc.placeholderEvent = function(options) {
		var $target = $(options.targetID);
		var placeholderVal = $target.attr('placeholder');

		// 初期ロード時
		if ($target.val() === '') {
			$target.val(placeholderVal).addClass('js-placeholder');
		} else {
			$target.removeClass('js-placeholder');
		}
		$target.focus(function() {
			if ($target.hasClass('js-placeholder')) {
				$target.val('').removeClass('js-placeholder');
			}
		}).blur(function() {
			if ($target.val() === '' || $target.val() === placeholderVal) {
				$target.val(placeholderVal).addClass('js-placeholder');
			}
		});
	};
	// 上書きしたので再実行
	suumo.inc.placeholderEvent(options);
};

/**
 * [setCookie クッキー値をセットする関数]
 * @param {Object} options クッキー名とクッキー値.
 */
suumo.inc.setCookie = function(options) {
	var date = new Date();
	date.setFullYear(date.getFullYear() + 1);
	var value = options.value + ';path=/ ;expires=' + date.toGMTString() + ';';
	document.cookie = options.name + '=' + value;
};

/**
 * controller
 */
// フッターの検索
var $wordSearchForm = $('#js-wordSearch');

$('#js-footerKensakuBtn').click(function() {
	$wordSearchForm.submit();
	return false;
});

$wordSearchForm.submit(function() {
	if (suumo.inc.isEmptyInput('#js-linkbox-search')) {
		return false;
	}
	return true;
});

suumo.inc.placeholderEvent({
	targetID: '#js-linkbox-search'
});

// フッターの高さ揃える
suumo.inc.heightLine('#js-footnav .js-heightline');

// 全国へ飛ぶ時のクッキー値更新
$('.js-setCookieArZenkoku').click(function() {
	suumo.inc.setCookie({
		'name' : 'ar',
		'value' : '000'
	});
});
