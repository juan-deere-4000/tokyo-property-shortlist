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
 * [物件ライブラリー詳細ページ用名前空間]
 *
 * @namespace
 */
suumo.bknLibraryDetail = suumo.bknLibraryDetail || {};

suumo.bknLibraryDetail.constants = {
	HIDDEN_CLASS: 'is-hidden',
	CLOSED_CLASS: 'is-closed'
};

/**
 * [ifExists]
 * @example
 * ifExists.dom($('#js-ifExistsPanel'), function() {
 *	 var $target = this;
 *
 *	 $target.css('width', 1000).addClass('dn');
 * };
 */
suumo.bknLibraryDetail.ifExists = {
	/**
	 * [要素の存在をチェックして実行]
	 * @param	{Object}	 $target	チェックしたい要素
	 * @param	{Function} callback 存在した場合の処理
	 * @return {Boolean}	ifExists?
	 */
	dom: function($target, callback) {
		'use strict';

		var args = Array.prototype.slice.call(arguments, 1);

		if ($target === null || $target.length === 0 || !callback) {
			return false;
		}

		callback.call($target, args);

		return true;
	}
};

/**
 * [ReviewAccordion レビューテーブルアコーディオン]
 * @constructor
 * @param {JQuery} options.$target レビューアコーディオン要素
 * @param {string} options.rows テーブルの行
 * @param {string} options.buttonText アコーディオンボタンテキスト
 * @param {string} options.HIDDEN_INDEX 表示する行数
 * @return {Void} 何も返さない.
 */
suumo.bknLibraryDetail.ReviewAccordion = function(options) {
	'use strict';

	var self = this;

	self.$target = options.$target;
	self.$rows = self.$target.find(options.rows);
	self.$button = self.$target.find(options.button);

	self.HIDDEN_INDEX = options.HIDDEN_INDEX;
};

/**
 * [openTable テーブルを開き、ボタンテキスト等を変更する]
 * @return {Void} 何も返さない.
 */
suumo.bknLibraryDetail.ReviewAccordion.prototype.openTable = function() {
	'use strict';

	var self = this;

	self.$rows.slice(self.HIDDEN_INDEX).removeClass(suumo.bknLibraryDetail.constants.HIDDEN_CLASS);
	self.$button.addClass(suumo.bknLibraryDetail.constants.CLOSED_CLASS);
	self.$button.text('閉じる');
};

/**
 * [closeTable テーブルを閉じ、ボタンテキスト等を変更する]
 * @return {Void} 何も返さない.
 */
suumo.bknLibraryDetail.ReviewAccordion.prototype.closeTable = function() {
	'use strict';

	var self = this;

	self.$rows.slice(self.HIDDEN_INDEX).addClass(suumo.bknLibraryDetail.constants.HIDDEN_CLASS);
	self.$button.removeClass(suumo.bknLibraryDetail.constants.CLOSED_CLASS);
	self.$button.text('もっと見る');
};

/*
 * controller
 */
suumo.bknLibraryDetail.ifExists.dom($('#js-review-accordion'), function() {
	'use strict';

	var $this = this;

	var reviewAccordion = new suumo.bknLibraryDetail.ReviewAccordion({
		$target: $this,
		rows: '.js-review-table_row',
		button: '.js-review-accordion_button',
		HIDDEN_INDEX: 5
	});

	// もっと見る/閉じる ボタンが押された時
	$this.find('.js-review-accordion_button').bind('click', function() {
		// 行が隠されているかどうかを判定
		var isHidden = reviewAccordion.$rows.hasClass(suumo.bknLibraryDetail.constants.HIDDEN_CLASS);

		if(isHidden) {
			reviewAccordion.openTable();
		} else {
			reviewAccordion.closeTable();
		}
	});
});
