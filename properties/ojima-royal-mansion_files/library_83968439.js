/**
 * @license Copyright (C) Recruit Sumai Company Ltd.
 */
// header検索例
$(function(){
	$("input#kns01").css("color","#CCCCCC");
	$("#kns01").focus(function(){
		if(this.value == "住所・駅名・マンション名などを入力"){
			$(this).val("").css("color","#000000");
		}
	});
	$("#kns01").blur(function(){
		if(this.value == ""){
			$(this).val("住所・駅名・マンション名などを入力").css("color","#CCCCCC");
		}
	});
});

$(function(){
	if($("#knstop").val() == "住所、駅名、マンション名などを入力"){
		$("input#knstop").css("color","#CCCCCC");
	}else{
		$("input#knstop").css("color","#000000");
	}

	$("#knstop").focus(function(){
		if(this.value == "住所、駅名、マンション名などを入力"){
			$(this).val("").css("color","#000000");
		}
	});
	$("#knstop").blur(function(){
		if(this.value == ""){
			$(this).val("住所、駅名、マンション名などを入力").css("color","#CCCCCC");
		}
	});
});

/**
 *
 * [ library用 ]
 *
 * @namespace
 */
library = {};

library.constants = {
	ACTIVE_CLASS: 'is-active',
	INACTIVE_CLASS: 'is-inactive',
	DURATION: 300
};

/**
 * [ Carousel 初期load設定]
 *
 *
 */
library.Carousel = function(options){
	'use strict';

	var self = this;

	// 初期load設定
	self.moveCount = 3;
	self.$targetID = $(options.targetID);
	self.$slider = $('#' + self.$targetID.attr('id') + '-slider');
	self.$slickObject = $('#' + self.$targetID.attr('id') + '-object img');
	self.$slickObjectImg = $('#' + self.$targetID.attr('id') + '-object img');
	self.$slickText = $('#' + self.$targetID.attr('id') + '-text');
	self.$slickNum = $('#' + self.$targetID.attr('id') + '-num');
	self.$slickReadActive = self.$targetID.find('.' + self.$targetID.attr('id') + '-thumb');

	self.$btnPrev = $(options.btnPrevID);
	self.$btnNext = $(options.btnNextID);
	self.idx = 0;
	self.duration = library.constants.DURATION;
	self.activeClass = library.constants.ACTIVE_CLASS;
	self.flgAnimate = false;

	// 一度に動かすDOM(li)数
	if(options.moveCount) {
		self.moveCount = options.moveCount;
	}

	// 一度に動かす値(px)の計算
	self.itemCell = self.$slider.children().length / self.moveCount;
	self.itemNum = Math.ceil(self.itemCell);

	// 一つのサムネイルDOMの幅を取得
	var $item = self.$slider.children().eq(1);
	self.itemWidth = $item.outerWidth(true) * self.moveCount;

	// 全体幅の計算とstyle吐き出し
	self.$slider.css('width', self.itemWidth * self.itemNum - parseInt($item.css('margin-left'), 10));

	// 初期サムネイルactive設定
	self.$slickReadActive.eq(0).addClass(self.activeClass);
};

/**
 * [ next Nextボタン カルーセル進む ]
 */
library.Carousel.prototype.next = function(){
	'use strict';

	var self = this;


	if(self.flgAnimate){
		return false;
	}

	// カセットを動かすごとに+1
	self.idx++;

	// ボタン制御 roop
	self.roopIdx();

	// カセット移動処理
	self.move();
};

/**
 * [ prev Prevボタン カルーセル戻る ]
 */
library.Carousel.prototype.prev = function(){
	'use strict';

	var self = this;


	if(self.flgAnimate){
		return false;
	}

	// カセットを動かすごとに+1
	self.idx--;

	// ボタン制御 roop
	self.roopIdx();

	// カセット移動処理
	self.move();
};

/**
 * [ move カセット移動処理 ]
 */
library.Carousel.prototype.move = function(){
	'use strict';

	var self = this;

	// カセット移動処理でtrueへ変更
	self.flgAnimate = true;

	// marginleft移動
	self.$slider.animate({
		marginLeft: self.idx * -self.itemWidth
	}, {
			complete: function(){
				self.flgAnimate = false;
			}
	});
};

/**
 * [ roopIdx ボタン制御 roop ]
 */
library.Carousel.prototype.roopIdx = function(){
	'use strict';

	var self = this;

	if(self.idx < 0){
		self.idx = self.itemNum -1;
	}
	if(self.idx > self.itemNum -1){
		self.idx = 0;
	}
};

/**
 * [ chgSlickObject サムネイル画像挙動 ]
 */
library.Carousel.prototype.chgSlickObject = function($click){
	'use strict';

	var self = this;
	var $img = $click.find('img');

	self.$slickObjectImg.attr({
		src: $img.attr('src'),
		alt: $img.attr('alt')
	});

	self.$slickObjectImg.attr({
		'data-modal-object': $click.attr('href'),
		'data-modal-width': $click.attr('data-modal-width'),
//		'data-modal-height': $click.attr('data-modal-height')
	});

	self.$slickText.html($img.attr('alt'));
	self.$slickNum.html($img.attr('data-slick-thumb'));

	// サムネイルactive処理
	if($click.hasClass(self.activeClass)){
		return;
	}
	$('.js-slick-thumb').removeClass(self.activeClass);
	$click.addClass(self.activeClass);
};


/**
 * [ ImgModal モーダル初期読み込み ]
 *
 */
library.ImgModal = function(options){
	'use strict';

	var self = this;

	// 初期load設定
	self.$overlay = $('#js-imgModal-overlay');
	self.$modalView = $('#js-imgModal-view');
	self.$triggerID = $(options.triggerID);
	self.$triggerImg = self.$triggerID.find('img');
	self.$modalViewImg = self.$modalView.find('img');

	self.activeClass = library.constants.ACTIVE_CLASS;
};

/**
 * [ open モーダル画像拡大表示の挙動 ]
 */
library.ImgModal.prototype.open = function(){
	'use strict';

	var self = this;

	var imageWidth = self.$triggerImg.attr('data-modal-width');
	if(self.$triggerImg.get(0).naturalWidth < self.$triggerImg.attr('data-modal-width') ) {
		imageWidth = self.$triggerImg.get(0).naturalWidth;
	}

	// モーダル内にパラメータをセット（画像パスとタイトルと画像サイズ）
	self.$modalViewImg
	.attr({
		src: self.$triggerImg.attr('data-modal-object'),
		alt: self.$triggerImg.attr('alt'),
		width: imageWidth,
//		height: self.$triggerImg.attr('data-modal-height')
	});

	// アニメーション完了時のサイズをキャッシュしておく
	self.propModalViewSize = {
		width: self.$triggerImg.attr('data-modal-width'),
//		height: self.$triggerImg.attr('data-modal-height')
	};

	// モーダルの初期位置とサイズ設定
	self.$modalView.css({
		width: 'auto',
		height: 'auto',
		top: self.$triggerImg.offset().top - parseInt(self.$modalView.css('padding-top'), 10),
		left: self.$triggerImg.offset().left - parseInt(self.$modalView.css('padding-left'), 10)
	});
	self.$modalViewImg.css({
		width: self.$triggerImg.width(),
//		height: self.$triggerImg.height()
	});

	// アニメーション先の座標計算（画面に対してのセンタリング位置とサイズ）
	var $win = $(window);
	var windowWidth = $win.width();
	var windowHeight = $win.height();
	self.propModalViewPos = {
//		top: (windowHeight - self.propModalViewSize.height) / 2 + $win.scrollTop(),
		left: (windowWidth - self.propModalViewSize.width) / 2
	};

	// オーバーレイの表示アニメーション
	self.$overlay.show();

	// モーダルを初期位置で表示
	self.$modalView
	.show()
	// アニメーション処理 （位置とサイズ）
	.animate($.extend({}, self.propModalViewSize, self.propModalViewPos), library.constants.DURATION);

	self.$modalViewImg
	.animate({
		width: self.$modalViewImg.attr('width'),
//		height: self.$modalViewImg.attr('height')
	}, library.constants.DURATION);
};

/**
 * [ refresh モーダルの画面リサイズ時の処理 ]
 */
library.ImgModal.prototype.refresh = function(){
	'use strict';

	var self = this;

	// 画面サイズからモーダルの表示位置を計算する
	var $win = $(window);
	var windowWidth = $win.width();
	var windowHeight = $win.height();
	self.propModalViewPos = {
//		top: (windowHeight - self.propModalViewSize.height) / 2 + $win.scrollTop(),
//		left: (windowWidth - self.propModalViewSize.width) / 2
	};

	// 計算結果の適用
	self.$modalView.css({
		top: self.propModalViewPos.top,
		left: self.propModalViewPos.left
	});
};

/**
 * [ close モーダル閉じる処理 ]
 */
library.ImgModal.prototype.close = function($close){
	'use strict';

	var self = this;

	// フェードアウト
	self.$modalView.fadeOut('library.constants.DURATION');
	self.$overlay.fadeOut('library.constants.DURATION');
};

/**
 * controller
 */
$(function(){

	// slick 初期読み込み
	var $slickbox = $('#js-slick');// 大枠
	var $slickBtnNext = $('#js-slick-next');// 次へボタン
	var $slickBtnPrev = $('#js-slick-prev');// 次へボタン
	var slick = new library.Carousel({
		targetID: $slickbox,
		btnPrevID: $slickBtnPrev,
		btnNextID: $slickBtnNext
	});

	// nextボタン
	$slickBtnNext.bind('click', function(){
		slick.next();
	});

	// prevボタン
	$slickBtnPrev.bind('click', function(){
		slick.prev();
	});

	// サムネイルクリック（拡大窓表示）
	$slickbox
	.delegate('.js-slick-thumb', 'click', function(){
		slick.chgSlickObject($(this));
		return false;
	});

	// modal 初期読み込み
	var $modalTrigger = $('#js-modal-trigger');
	var modal = new library.ImgModal({
		triggerID: $modalTrigger
	});

	// 拡大窓イメージクリックモーダル表示
	$modalTrigger.bind('click', function(){
		modal.open();
	});

	// モーダル閉じる
	$(document)
	.delegate('.js-imgModal-close', 'click', function(){
		modal.close();
	});

	// 画面リサイズ
	$(window).bind('resize', function(){
		modal.refresh();
	});
});

//駅選択画面 チェック制御
$(function() {
	$('input[name="t23k"]').click(function() {
		if ($('input[name="t23k"]:checked').length > 50) {
			$(this).prop('checked', false);
			alert('これ以上は選択できません。');
			return false;
		}
	});
});
