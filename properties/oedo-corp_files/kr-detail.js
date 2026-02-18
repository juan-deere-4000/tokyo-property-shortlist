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
* [krDetail 新築一戸建て詳細用名前空間]
 *
 * @namespace
 */
suumo.krDetail = suumo.krDetail || {};

suumo.krDetail.constants = {
	ACTIVE_CLASS: 'is-active',
	INACTIVE_CLASS: 'is-inactive',
	LOADING_CLASS: 'is-loading',
	LOADED_CLASS: 'is-loaded',
	OPEN_CLASS: 'is-open',
	CLOSE_CLASS: 'is-close',
	IMMEDIATE_CLASS: 'is-immediate',
	scrollLazyDepth: 0
};

/**
 * [ifExists]
 *
 * @example
 * ifExists.dom($('#js-ifExistsPanel'), function() {
 *   var $target = this;
 *
 *   $target.css('width', 1000).addClass('dn');
 * };
 */
suumo.krDetail.ifExists = {
	/**
	 * [要素の存在をチェックして実行]
	 * @param  {Object}   $target  チェックしたい要素
	 * @param  {Function} callback 存在した場合の処理
	 * @return {Boolean}  ifExists?
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
 * [slideLazy 一覧カセットのスライドボタン押下時の画像取得]
 * @param  {Array} list lazyloadするDOMの配列.
 * @return {Boolean}    falseを返す.
 */
suumo.krDetail.slideLazy = function(list) {
	'use strict';

	$.each(list, function(index, obj) {
		obj.each(function() {
			var $container = $(this);
			var $loadImg = $container.find('.js-slideLazy-image');
			var $loader = $container.find('.js-slideLazy-loader');

			if ($loadImg.attr('rel') !== undefined) {
				$loadImg.bind('load', function() {
					$loader.remove();
					$loadImg
						.removeAttr('rel')
						.removeClass('js-slideLazy');
				});

				$loadImg.attr('src', $loadImg.attr('rel'));
			}
		});
	});

	return false;
};

/**
 * [scrollLazy 縦ウィンドウサイズに合わせての画像取得]
 * @param  {Object} options ターゲットのクラス名(options.className).
 * @return {Boolean}   falseを返す.
 */
suumo.krDetail.scrollLazy = function(options) {
	var $window = $(window);
	var $target = $('.' + options.className);
	var count = $('.' + options.className + '-image').length;
	var border;

	if (count === 0) {
		// ターゲットが0個ならアンバインド
		$window.unbind('scroll.lazy');
		return false;
	}

	border = $window.scrollTop() + $window.height();

	$target.each(function() {
		var $self = $(this);
		var $loadImg = $self.find('.' + options.className + '-image').attr('src', '');
		var $loader = $self.find('.' + options.className + '-loader');

		if ($loadImg.offset().top >= border) {
			// ターゲット画像がボーダーより下位置なら次ループ処理へ
			return true;
		}

		$loadImg.bind('load', function() {
			$loader.remove();
		});

		$loadImg.attr('src', $loadImg.attr('rel'));

		$self.removeClass(options.className);
		$loadImg.removeClass(options.className + '-image');
	});

	return false;
};

/**
 * [Carrousel カルーセル]
 * @class
 */
suumo.krDetail.Carrousel = function(options) {
	'use strict';

	var self = this;

	self.$container = options.$container;
	self.$carrouselBody = self.$container.find(options.carrouselBody);
	self.$items = self.$container.find(options.item);
	self.$prevBtn = self.$container.find(options.prevBtn);
	self.$nextBtn = self.$container.find(options.nextBtn);
	self.$caption = self.$container.find(options.caption);
	self.$captionText = self.$container.find(options.captionText);

	// 移動スピード
	self.duration = 200;
	// 移動イージング
	self.easing = 'swing';
	// 現在の画像id
	self.scrolled = 1;
	self.captionData = [];
	self.isCaptionClosed = false;

	// 初期設定
	self.init(options);
};
/**
 * [Carrousel カルーセルクラスのprototype]
 */
suumo.krDetail.Carrousel.prototype = {
	/**
	 * [getScrolled 現在のスクロール値を取得]
	 * @return {Number} 現在のスクロール値
	 */
	getScrolled: function() {
		'use strict';

		return this.scrolled;
	},
	/**
	 * [getWidthCountItems カルーセルでスライドさせる要素の幅を取得]
	 * @param {Object}  $items スライド対象DOM
	 * @return {Number} result スライド対象の幅
	 */
	getWidthCountItems: function($items) {
		'use strict';

		return $.map($items, function(i) {
			return $(i).outerWidth(true);
		})
		.reduce(function(i, j) {
			return i + j;
		}, 0);
	},
	/**
	 * [setNaviBtn 左右ボタンの表示状態変化]
	 * @param  {Number} scrolled 現在のスクロール値
	 * @param  {Number} length カルーセルのアイテム数
	 */
	setNaviBtn: function(scrolled, length) {
		'use strict';

		var self = this;

		if (length === 1) {
			self.$prevBtn.addClass(suumo.krDetail.constants.INACTIVE_CLASS);
			self.$nextBtn.addClass(suumo.krDetail.constants.INACTIVE_CLASS);

			return false;
		}

		if (scrolled === 1) {
			self.$prevBtn.addClass(suumo.krDetail.constants.INACTIVE_CLASS);
			self.$nextBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
		} else if (scrolled === length) {
			self.$prevBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
			self.$nextBtn.addClass(suumo.krDetail.constants.INACTIVE_CLASS);
		} else {
			self.$nextBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
			self.$prevBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
		}
	},
	/**
	 * [setCaption キャプションを設定]
	 * @param {Number}  index キャプションID
	 */
	setCaption: function(index) {
		'use strict';

		var self = this;

		self.$captionText.html(self.captionData[index] || "");
	},
	/**
	 * [showCaption キャプション表示]
	 */
	showCaption: function() {
		var self = this;

		if (self.$captionText.html().length > 0) {
			if (!self.isCaptionClosed) {
				self.$caption.stop().animate({
					bottom: 0
				}, {
					duration: self.duration,
					easing: self.easing
				});
			}
		}
	},
	/**
	 * [hideCaption キャプション非表示]
	 */
	hideCaption: function() {
		var self = this;

		self.$caption.stop().animate({
			bottom: -self.$caption.height()
		}, {
			duration: self.duration,
			easing: self.easing,
			complete: function() {
				self.isCaptionClosed = false;
			}
		});
	},
	/**
	 * [closeCaption キャプション閉じる]
	 */
	closeCaption: function() {
		var self = this;

		self.isCaptionClosed = true;

		self.$caption.stop().animate({
			bottom: -self.$caption.height()
		}, {
			duration: self.duration,
			easing: self.easing
		});
	},
	/**
	 * [moveTo スライド処理のエイリアス]
	 * @param  {Object} obj 識別要素（左右ボタン等）
	 * @param  {Number} num 移動先ナンバー
	 * @param  {Boolean} force 他のカルーセルがアニメ中にも強制的にアニメさせるフラグ.
	 */
	moveTo: function(num, force) {
		'use strict';

		var self = this;
		var $carrouselItem = self.$carrouselBody.find('.js-carouselItem');

		if (force !== true && self.isAnimate === true) {
			return false;
		}

		self.isAnimate = true;

		// 画像遅延読込（遷移先までの画像分 + 次の画像分）
		suumo.krDetail.slideLazy([
			$carrouselItem.filter(':lt(' + num + ')').find('.js-slideLazy'),
			$carrouselItem.eq(num).find('.js-slideLazy')
		]);

		self.$carrouselBody.stop().animate({
			left: -self.distance * (num - 1)
		}, {
			duration: self.duration,
			easing: self.easing,
			complete: function() {
				self.setNaviBtn(num, self.itemLength);
				self.isAnimate = false;
			}
		});

		// 次のキャプションを設定
		self.isCaptionClosed = false;
		self.setCaption(num - 1);
		if (self.$captionText.html().length > 0) {
			self.showCaption();
		} else {
			self.hideCaption();
		}
		self.scrolled = num;

		return num;
	},
	/**
	 * [sync カルーセルナビの動作に同期]
	 * @param {Number} id サムネイルID
	 */
	sync: function(id) {
		var self = this;

		self.moveTo(Number(id));
	},
	/**
	 * [init カルーセルをコントロールするためのオブジェクト生成]
	 */
	init: function() {
		'use strict';

		var self = this;

		self.itemLength = self.$items.length;
		self.distance = self.$items.eq(0).outerWidth(true);

		// キャプションのデータを格納
		self.$items.each(function() {
			self.captionData.push($(this).find('[data-caption]').attr('data-caption'));
		});
		// 最初のキャプションを設定
		self.setCaption(self.scrolled - 1);

		self.$carrouselBody.width(self.getWidthCountItems(self.$items));

		// ボタン初期設定
		self.setNaviBtn(1, self.itemLength);

		// 初回画像遅延読込（1枚目と2枚目）
		suumo.krDetail.slideLazy([self.$items.eq(0).find('.js-slideLazy'), self.$items.eq(1).find('.js-slideLazy')]);
	}
};

/**
 * [CarrouselNavigation カルーセルのナビゲーション]
 * @class
 */
suumo.krDetail.CarrouselNavigation = function(options) {
	'use strict';

	var self = this;

	self.$container = options.$container;
	self.$carrouselBody = self.$container.find(options.carrouselBody);
	self.$items = self.$container.find(options.item);
	self.$prevBtn = self.$container.find(options.prevBtn);
	self.$nextBtn = self.$container.find(options.nextBtn);



	// 移動スピード
	self.duration = 200;
	// 移動イージング
	self.easing = 'swing';
	// 現在の画像id
	self.scrolled = 1;
	// サムネイル1グループの最大値
	self.maxThumb = 8;

	// 初期設定
	self.init(options);
};
/**
 * [CarrouselNavigation カルーセルナビクラスのprototype]
 */
suumo.krDetail.CarrouselNavigation.prototype = {
	/**
	 * [getScrolled 現在のスクロール値を取得]
	 * @return {Number} 現在のスクロール値
	 */
	getScrolled: function() {
		'use strict';

		return this.scrolled;
	},
	/**
	 * [getWidthCountItems カルーセルでスライドさせる要素の幅を取得]
	 * @param {Object}  $items スライド対象DOM
	 * @return {Number} result スライド対象の幅
	 */
	getWidthCountItems: function($items) {
		'use strict';

		return $.map($items, function(i) {
			return $(i).width();
		})
		.reduce(function(i, j) {
			return i + j;
		}, 0);
	},
	/**
	 * [setNaviBtn 左右ボタンの表示状態変化]
	 * @param  {Number} scrolled 現在のスクロール値
	 * @param  {Number} length カルーセルのアイテム数
	 */
	setNaviBtn: function(scrolled, length) {
		'use strict';

		var self = this;

		if (length === 1) {
			self.$prevBtn.addClass(suumo.krDetail.constants.INACTIVE_CLASS);
			self.$nextBtn.addClass(suumo.krDetail.constants.INACTIVE_CLASS);

			return false;
		}

		if (scrolled === 1) {
			self.$prevBtn.addClass(suumo.krDetail.constants.INACTIVE_CLASS);
			self.$nextBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
		} else if (scrolled === length) {
			self.$prevBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
			self.$nextBtn.addClass(suumo.krDetail.constants.INACTIVE_CLASS);
		} else {
			self.$nextBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
			self.$prevBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
		}
	},
	/**
	 * [setThumbs サムネイル画像の表示状態変化]
	 * @param  {Number} id 対象サムネイルのid
	 */
	setThumbs: function(id) {
		'use strict';

		var self = this;

		if (id !== -1) {
			self.$items
				.removeClass(suumo.krDetail.constants.ACTIVE_CLASS)
				.eq(id - 1).addClass(suumo.krDetail.constants.ACTIVE_CLASS);
		}
	},
	/**
	 * [moveTo スライド処理のエイリアス]
	 * @param  {Object} obj 識別要素（左右ボタン等）
	 * @param  {Number} num 移動先ナンバー
	 * @param  {Boolean} force 他のカルーセルがアニメ中にも強制的にアニメさせるフラグ.
	 */
	moveTo: function(num, force) {
		'use strict';

		var self = this;
		var $navGroup = self.$carrouselBody.find('.js-navGroup');

		if (force !== true && self.isAnimate === true) {
			return false;
		}

		self.isAnimate = true;

		// 画像遅延読込（遷移先の次のコンテナ分）
		suumo.krDetail.slideLazy([$navGroup.eq(num).find('.js-slideLazy')]);

		self.$carrouselBody.stop().animate({
			left: -self.distance * (num - 1)
		}, {
			duration: self.duration,
			easing: self.easing,
			complete: function() {
				self.setNaviBtn(num, self.navLength);
				self.isAnimate = false;
			}
		});

		self.scrolled = num;

		return num;
	},
	/**
	 * [sync カルーセル本体の動作に同期]
	 * @param {Number} id サムネイルID
	 */
	sync: function(id) {
		var self = this;

		// サムネイルをセット
		self.setThumbs(id);
		// サムネイルグループを移動
		self.moveTo(Math.ceil(id / self.maxThumb), true);
	},
	/**
	 * [init カルーセルナビゲーションをコントロールするためのオブジェクト生成]
	 */
	init: function() {
		'use strict';

		var self = this;
		var $navGroup = self.$carrouselBody.find('.js-navGroup');

		self.navLength = $navGroup.length;
		self.distance = $navGroup.eq(0).outerWidth(true);

		self.$carrouselBody.width(self.getWidthCountItems($navGroup));

		// ボタン初期設定
		self.setNaviBtn(1, self.navLength);
		// サムネイル初期設定
		self.setThumbs(1);
		// 初回画像遅延読込（1枚目と2枚目）
		suumo.krDetail.slideLazy([$navGroup.eq(0).find('.js-slideLazy'), $navGroup.eq(1).find('.js-slideLazy')]);
	}
};

/**
 * [Accordion アコーディオン機能]
 * @constructor
 * @param {Object} options 引数を格納するオブジェクト
 * @param {Object} $container 親要素
 * @param {String} accordion アコーディオンのセレクタ
 */
suumo.krDetail.Accordion = function(options) {
	'use strict';

	var self = this;

	self.$container = options.$container;
	self.$accordionItem = self.$container.find(options.accordion);
	self.bukkenCode = self.$container.find('#js-bukken_code').text();
	self.isHold = true;

	// サブサイトでは状態保持しない
	if (/inaka|bessou/.test(window.location.host) || !self.bukkenCode) {
		self.isHold = false;
		return;
	}

	// アコーディオンの開閉状態を保持するためのフラグ（デフォルトは全て open）
	var initialFlagList = Array(self.$accordionItem.length);
	for (var i = 0; i < initialFlagList.length; i++) {
		initialFlagList[i] = true;
	};

	self.isOpenFlagList = JSON.parse(sessionStorage.getItem('isOpenFlagList_' + self.bukkenCode)) || initialFlagList;

	self.init();
}

suumo.krDetail.Accordion.prototype = {
	init: function() {
		'use strict';
		var self = this;

		// flag が false ならアコーディオンを閉じる
		self.$accordionItem.each(function(i) {
			if(!self.isOpenFlagList[i]) {
				var $target = $(this);
				$target.addClass(suumo.krDetail.constants.CLOSE_CLASS);
				$target.find('.js-acc_contents').slideUp(200);
			}
		});
	},
	switch: function($elm) {
		'use strict';
		var self = this;

		var $contents = $elm.find('.js-acc_contents');
		var isOpen = $contents.is(':visible');

		$elm.toggleClass(suumo.krDetail.constants.CLOSE_CLASS, isOpen);
		$contents.slideToggle(200);

		// 開閉状態を保存
		if (self.isHold) {
			var i = self.$accordionItem.index($elm);
			self.isOpenFlagList[i] = !isOpen;
			sessionStorage.setItem('isOpenFlagList_' + self.bukkenCode, JSON.stringify(self.isOpenFlagList));
		}
	}
}

//
// controller
//
suumo.krDetail.ifExists.dom($('#js-mainImageCarousel'), function() {
	var $mainImageCarousel = this;
	var $mainImageCarouselNav = $('#js-mainImageCarouselNav');
	var mainImageCarousel;
	var mainImageCarouselNavigation;

	// Carrouselクラスのインスタンス化
	mainImageCarousel = new suumo.krDetail.Carrousel({
		$container: $mainImageCarousel,
		carrouselBody: '.js-carouselBody',
		item: '.js-carouselItem',
		caption: '.js-carouselCaption',
		captionText: '.js-carouselCaptionText',
		prevBtn: '.js-carouselPrevBtn',
		nextBtn: '.js-carouselNextBtn'
	});

	// CarrouselNavigationクラスのインスタンス化
	mainImageCarouselNavigation = new suumo.krDetail.CarrouselNavigation({
		$container: $mainImageCarouselNav,
		carrouselBody: '.js-navBody',
		item: '.js-navItem',
		prevBtn: '.js-navPrevBtn',
		nextBtn: '.js-navNextBtn'
	});

	$mainImageCarousel
		.find('.js-carouselNextBtn')
			.live('click', function() {
				var self = this;
				var nextID;

				suumo.krDetail.slideLazy([$mainImageCarousel, $mainImageCarouselNav]);

				if (!$(self).hasClass(suumo.krDetail.constants.INACTIVE_CLASS)) {
					nextID = mainImageCarousel.moveTo(mainImageCarousel.getScrolled() + 1);
				}

				// ナビのsync
				if (nextID) {
					mainImageCarouselNavigation.sync(nextID);
				}

				return false;
			})
		.end()
		.find('.js-carouselPrevBtn')
			.live('click', function() {
				var self = this;
				var nextID;

				suumo.krDetail.slideLazy([$mainImageCarousel, $mainImageCarouselNav]);

				if (!$(self).hasClass(suumo.krDetail.constants.INACTIVE_CLASS)) {
					nextID = mainImageCarousel.moveTo(mainImageCarousel.getScrolled() - 1);
				}

				// ナビのsync
				if (nextID) {
					mainImageCarouselNavigation.sync(nextID);
				}

				return false;
			})
		.end()
		.find('.js-carouselCaptionClose')
			.live('click', function() {
				mainImageCarousel.closeCaption();

				return false;
			}).end()
		.hover(
			// キャプション表示
			function() {
				mainImageCarousel.showCaption();
			},
			// キャプション非表示
			function() {
				mainImageCarousel.hideCaption();
			}
		);

	$mainImageCarouselNav
		.find('.js-navNextBtn')
			.live('click', function() {
				var self = this;

				if (!$(self).hasClass(suumo.krDetail.constants.INACTIVE_CLASS)) {
					mainImageCarouselNavigation.moveTo(mainImageCarouselNavigation.getScrolled() + 1);
				}

				return false;
			}).end()
		.find('.js-navPrevBtn')
			.live('click', function() {
				var self = this;

				if (!$(self).hasClass(suumo.krDetail.constants.INACTIVE_CLASS)) {
					mainImageCarouselNavigation.moveTo(mainImageCarouselNavigation.getScrolled() - 1);
				}

				return false;
			}).end()
		.find('.js-navItem')
			.live('click', function() {
				var self = this;
				var id = $(self).attr('data-id');

				// サムネイルの状態変化
				mainImageCarouselNavigation.setThumbs(id);

				// 本体カルーセルとのsync
				mainImageCarousel.sync(id);

				return false;
			});
});


/**
 * [Lightbox ライトボックス]
 * @class
 */
suumo.krDetail.Lightbox = function(options) {
	'use strict';

	var self = this;

	self.$container = options.$container;
	self.$items = self.$container.find(options.item);

	self.currentIndex = 1;

	// データ
	self.categoryData = [];
	self.srcData = [];
	self.captionData = [];

	self.init();
};
/**
 * [Lightbox ライトボックスクラスのprototype]
 */
suumo.krDetail.Lightbox.prototype = {
	/**
	 * [getCurrentIndex 現在表示されている画像IDを取得]
	 * @return {Number} id 画像ID
	 */
	getCurrentIndex: function() {
		'use strict';

		return this.currentIndex;
	},
	/**
	 * [getLightbox lightboxの中身を取得]
	 * @param  {Number} id 画像id
	 * @return {Object} 生成したlightboxオブジェクト
	 */
	getLightbox: function(id) {
		'use strict';

		var self = this;

		var $container = $('<div class="lightbox" />');
		var $containerCloseBtn = $('<a href="javascript:void(0);" class="lightbox-close js-lightbox-close" />');
		var $containerInner = $('<div class="lightbox-inner" />');

		$containerCloseBtn.append($('<span class="kr_detail-carrousel kr_detail-carrousel--close" />'));
		$containerInner.append(self.getLightboxInner(id));

		return $container.append($containerCloseBtn).append($containerInner);
	},
	/**
	 * [getLightboxInner lightboxの中身を取得]
	 * @param  {Number} id 画像id
	 * @return {Object} 生成したlightboxのコンテンツ
	 */
	getLightboxInner: function(id) {
		'use strict';

		var self = this;

		var $inner = $('<div class="lightbox_inner" />');
		var $innerHeader = $('<div class="lightbox_inner-header" />');
		var $innerBody = $('<div class="lightbox_inner-body" />');
		var $innerFooter = $('<div class="lightbox_inner-footer" />');

		$innerHeader.append($('<div class="lightbox_title" />').text(self.categoryData[id - 1]));
		$innerBody.append(self.getLightboxContents(id));
		$innerFooter.append($('<p class="lightbox_caption" />').html(self.captionData[id - 1]));

		return $inner.append($innerHeader).append($innerBody).append($innerFooter);
	},
	/**
	 * [getLightboxContents lightboxの中身を取得]
	 * @param  {Number} id 画像id
	 * @return {Object} 生成したlightboxのコンテンツ
	 */
	getLightboxContents: function(id) {
		'use strict';

		var self = this;

		var $container = $('<div class="lightbox_photo" />');
		var $containerPrevButton = $('<a href="javascript:void(0);" class="lightbox_photo-control js-lightbox-prev" />');
		var $containerBody = $('<div class="lightbox_photo-body" />');
		var $containerNextButton = $('<a href="javascript:void(0);" class="lightbox_photo-control js-lightbox-next" />');

		$containerPrevButton.append($('<span class="lightbox_photo-control-icon"><span class="kr_detail-carrousel kr_detail-carrousel--arrow_left_gray"></span></span>'));
		$containerBody.append(self.getLightboxImage(id));
		$containerNextButton.append($('<span class="lightbox_photo-control-icon"><span class="kr_detail-carrousel kr_detail-carrousel--arrow_right_gray"></span></span>'));

		return $container.append($containerPrevButton).append($containerBody).append($containerNextButton);
	},
	/**
	 * [getLightboxImage lightboxの中身を取得]
	 * @param  {Number} id 画像id
	 * @return {Object} 生成したlightboxのコンテンツ
	 */
	getLightboxImage: function(id) {
		'use strict';

		var self = this;

		var $container = $('<div class="lightbox_image" />');
		var $layout = $('<div class="lightbox_image-layout" />');
		var $inner = $('<div class="lightbox_image-layout-inner" />');
		var $image = $('<img class="js-noContextMenu"/>').attr('src', self.srcData[id - 1]);

		return $container.append($layout.append($inner.append($image)));
	},
	/**
	 * [moveTo 画像切替]
	 * @param  {Number} id 画像id
	 */
	moveTo: function(id) {
		'use strict';

		var self = this;

		if (id === 0 || id === self.$items.length + 1) {
			return false;
		}

		self.$lightbox.fadeTo(100, 0, function() {
			self.$lightbox.remove();
			self.change(id);
		});
	},
	/**
	 * [setBtn 左右ボタンの表示状態変化]
	 * @param  {Number} scrolled 現在のスクロール値
	 * @param  {Number} length カルーセルのアイテム数
	 */
	setBtn: function() {
		'use strict';

		var self = this;
		var $prevBtn = self.$lightbox.find('.js-lightbox-prev');
		var $nextBtn = self.$lightbox.find('.js-lightbox-next');

		if (Number(self.currentIndex) === 1) {
			$prevBtn.addClass(suumo.krDetail.constants.INACTIVE_CLASS);
			$nextBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
		} else if (Number(self.currentIndex) === self.$items.length) {
			$prevBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
			$nextBtn.addClass(suumo.krDetail.constants.INACTIVE_CLASS);
		} else {
			$nextBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
			$prevBtn.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
		}
	},
	/**
	 * [change Lightbox切替]
	 * @param  {Number} id 画像id
	 */
	change: function(id) {
		'use strict';

		var self = this;

		self.currentIndex = id;

		self.$lightbox = $('<div class="l-lightbox" />').fadeTo(0, 0);
		self.$lightbox.append(self.getLightbox(id));

		$('body')
			.append(self.$lightbox);
		self.$lightbox.fadeTo(100, 1);

		self.setBtn();
	},
	/**
	 * [open Lightbox起動]
	 * @param  {Number} id 画像id
	 */
	open: function(id) {
		'use strict';

		var self = this;

		self.currentIndex = id;

		self.$lightbox = $('<div class="l-lightbox" />').fadeTo(0, 0);
		self.$lightbox.append(self.getLightbox(id));
		self.$backLayer = $('<div class="lightbox_overlay js-lightbox-close" />').fadeTo(0, 0);

		$('body')
			.append(self.$backLayer)
			.append(self.$lightbox);
		self.$backLayer.fadeTo(200, 0.7);
		self.$lightbox.fadeTo(200, 1);

		self.setBtn();
	},
	/**
	 * [close Lightbox終了]
	 */
	close: function() {
		'use strict';

		var self = this;

		if (self.$lightbox !== undefined) {
			self.$lightbox.fadeTo(200, 0, function() {
				self.$lightbox.remove();
			});
		}

		if (self.$backLayer !== undefined) {
			self.$backLayer.fadeTo(200, 0, function() {
				self.$backLayer.remove();
			});
		}

	},
	/**
	 * [init 初期設定]
	 */
	init: function() {
		'use strict';

		var self = this;

		self.$items.each(function(index) {
			var $item = $(this);
			self.categoryData[index] = $item.attr('data-category');
			self.srcData[index] = $item.attr('data-src');
			self.captionData[index] = $item.attr('data-caption');
		});
	}
};

/**
 * [Tab タブ機能]
 * @constructor
 * @param {String} options 引数を格納するオブジェクト
 * @param {String} targetID タブ機能の親セレクタ
 * @param {String} tabSelector タブのセレクタ
 * @param {String} contentsSelector コンテンツのセレクタ
 */
suumo.krDetail.Tab = function(options) {
	'use strict';

	var self = this;

	self.$target = $(options.targetID);
	self.$tab = self.$target.find(options.tabSelector);
	self.$contents = self.$target.find(options.contentsSelector);
};

/**
 * [change タブの切り替え]
 * @param {Object} $elem クリックされた要素
 * @return {Void} 何も返さない
 */
suumo.krDetail.Tab.prototype.change = function($elem) {
	'use strict';

	var self = this;

	self.$tab.removeClass(suumo.krDetail.constants.ACTIVE_CLASS);
	self.$contents.removeClass(suumo.krDetail.constants.ACTIVE_CLASS);

	$elem.addClass(suumo.krDetail.constants.ACTIVE_CLASS);
	self.$contents.eq($elem.attr('data-tab')).addClass(suumo.krDetail.constants.ACTIVE_CLASS);
};

/**
 * [lazyload レイジーロード]
 * @param {Object} options 引数を格納するオブジェクト.
 * @param {Object} options.targetID 対象のオブジェクト.
 * @param {String} options.errImg 読み込みエラー時に表出させる画像パス.
 * @param {Function} options.callback コールバック.
 * @return {Void} 何も返さない.
 */
suumo.krDetail.lazyload = function(options) {
	'use strict';

	var $target = $(options.targetID);
	var $img = $target.find('img');
	var $tmpObj = $('<img>');
	var path = $img.attr('data-src');
	var errImg = '/edit/assets/suumo/img/kr_common-noimage_small.png';

	if (options.errImg) {
		errImg = options.errImg;
	}

	// 機能的に取り回しが難しくなってしまうため止む無くここにハンドラを記述する
	$img.bind('load.lazyload_imgage', function() {
		$target.addClass(suumo.krDetail.constants.LOADED_CLASS);
		// 不要なイベントハンドラ及び要素の削除
		$img.unbind('load.lazyload_imgage');
		$tmpObj.unbind();
		$tmpObj = null;
		// コールバックが指定されていた場合は実行
		if (options.callback) {
			options.callback.call($img.get(0));
		}
	}).attr('src', path);

	// IEで正常にエラーイベントを取得するために別オブジェクトでエラーイベントを取得
	$tmpObj.bind('error', function() {
		// エラー用画像パス設定（再度画像読み込みを実行しloadイベントを発火させる）
		$img.attr('src', errImg);
	}).attr('src', path);
};

/**
 * [ScrollTrigger用定数]
 */
suumo.krDetail.constants.ScrollTrigger = {
	/**
	 * [SCROLL_OFFSET スクロール判定時のオフセット値]
	 * @type {Number}
	 */
	SCROLL_OFFSET: 500,

	/**
	 * [REDUCE_MILLISEC スクロールイベントの抑制値（ミリ秒）]
	 * @type {Number}
	 */
	REDUCE_MILLISEC: 100,

	/**
	 * [SERIAL_LENGTH シリアルコード発行時の桁数]
	 * @type {Number}
	 */
	SERIAL_LENGTH: 8,

	/**
	 * [SERIAL_LENGTH シリアルコードで生成する文字列に含める文字セット]
	 * @type {String}
	 */
	SERIAL_KEYWORD: 'abcdefghijklmnopqrstuvwxyz0123456789'
};

/**
 * [ScrollTrigger スクロールトリガー]
 * @constructor
 * @desc 画面サイズとスクロール値から表出タイミングを判定しcallbackを実行します。
 */
suumo.krDetail.ScrollTrigger = function() {
	'use strict';

	var self = this;

	self.$win = $(window);
	self.arTaskList = [];
	self.scrollVal = 0;
	self.winHeight = self.$win.height();
	self.scrollOffset = suumo.krDetail.constants.ScrollTrigger.SCROLL_OFFSET;
	self.serialLength = suumo.krDetail.constants.ScrollTrigger.SERIAL_LENGTH;
	self.serialKeyword = suumo.krDetail.constants.ScrollTrigger.SERIAL_KEYWORD;
	self.reduseMillisec = suumo.krDetail.constants.ScrollTrigger.REDUCE_MILLISEC;
	self.serial = self.getSerial();
	self.flgTask = true;
};

/**
 * [watch 監視の開始]
 * @return {Void} 何も返さない
 */
suumo.krDetail.ScrollTrigger.prototype.watch = function() {
	'use strict';

	var self = this,
		timer;

	// 初回分は直接発火させる
	self.judgeScroll(self.$win.scrollTop() + self.winHeight + self.scrollOffset);

	// 機能的にイベントバインドを関数に内包しないと取り回しが難しいため、関数内でイベントバインドをしています
	self.$win.bind('scroll.' + self.serial, function() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			self.doProcess();
		}, self.reduseMillisec);
	});

	self.$win.bind('resize.' + self.serial, function() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			self.winHeight = self.$win.height();
			self.doProcess();
		}, self.reduseMillisec);
	});
};

/**
 * [doProcess 処理実行]
 * @return {Void} 何も返さない
 */
suumo.krDetail.ScrollTrigger.prototype.doProcess = function() {
	'use strict';

	var self = this;

	if (!self.flgTask) {
		return false;
	}
	self.flgTask = false;
	self.judgeScroll(self.$win.scrollTop() + self.winHeight + self.scrollOffset);
	self.flgTask = true;

	// 同クラス内の関数でバインドしたイベントの制御
	if (self.isTaskComplete()) {
		self.$win.unbind('scroll.' + self.serial).unbind('resize.' + self.serial);
	}
};

/**
 * [judgeScroll scroll値に応じてタスクの処理を実行]
 * @param {Number} scroll 判定対象のスクロール値
 * @return {Void} 何も返さない
 */
suumo.krDetail.ScrollTrigger.prototype.judgeScroll = function(scroll) {
	'use strict';

	var self = this,
		arFilterList;

	arFilterList = self.filterTask(scroll);
	if (arFilterList.length === 0) {
		return;
	}
	self.doTask(arFilterList);
	self.updateTask(arFilterList);
};

/**
 * [addTask タスクの追加]
 * @param {Object} options 引数を格納するオブジェクト
 * @param {Object} options.triggerElement 判定するscroll値の基準となるDOM
 * @param {Object} options.callback 閾値を超えた時に実行するコールバック関数
 * @param {Object} options.callbackParam コールバック関数で使用する引数
 * @return {Void} 何も返さない
 */
suumo.krDetail.ScrollTrigger.prototype.addTask = function(options) {
	'use strict';

	var self = this, arTask, callbackParam, $trigger;

	$trigger = $(options.triggerElement);
	callbackParam = options.callbackParam;
	if (!options.callbackParam) {
		callbackParam = [];
	}

	// 配列の構成['index番号', scrollの閾値', '実行済フラグ(実行前はtrue): true', 'コールバック関数', 'コールバック関数に渡したい引数', 'コールバック関数のthis']
	arTask = [self.arTaskList.length, $trigger.offset().top, true, options.callback, callbackParam, $trigger];

	self.arTaskList.push(arTask);
};

/**
 * [filterTask scroll値に応じたタスクの抽出]
 * @param {Number} scroll 判定対象のスクロール値
 * @return {Array} 実行候補のタスク配列
 */
suumo.krDetail.ScrollTrigger.prototype.filterTask = function(scroll) {
	'use strict';

	var self = this;

	return self.arTaskList.filter(function(task) {
		return task[2] && task[1] <= scroll;
	});
};

/**
 * [doTask タスクの実行]
 * @param {Array} arFilterList スクロール値でフィルタリングしたタスク配列
 * @return {Void} 何も返さない
 */
suumo.krDetail.ScrollTrigger.prototype.doTask = function(arFilterList) {
	'use strict';

	arFilterList.forEach(function(task) {
		if (typeof task[3] === 'function') {
			task[3].apply(task[5].get(0), task[4]);
		}
	});
};

/**
 * [updateTask 保持しているタスク一覧の実行済みタスクを更新]
 * @param {Array} arFilterList スクロール値でフィルタリングしたタスク配列
 * @return {Void} 何も返さない
 */
suumo.krDetail.ScrollTrigger.prototype.updateTask = function(arFilterList) {
	'use strict';

	var self = this;

	arFilterList.forEach(function(task) {
		self.arTaskList[task[0]][2] = false;
	});
};

/**
 * [isTaskComplete 保持しているタスク一覧の実行済みタスクを更新]
 * @return {Boolean} 真偽値
 */
suumo.krDetail.ScrollTrigger.prototype.isTaskComplete = function() {
	'use strict';

	var self = this;

	return self.arTaskList.every(function(task) {
		return !task[2];
	});
};

/**
 * [getSerial イベント判別用シリアル発行]
 * @return {String} イベント名
 */
suumo.krDetail.ScrollTrigger.prototype.getSerial = function() {
	'use strict';

	var self = this,
		length = self.serialKeyword.length,
		result = '',
		i;

	for (i = 0; i < self.serialLength; i++) {
		result += self.serialKeyword[Math.floor(Math.random() * length)];
	}
	result += new Date().getTime();

	return result;
};

/**
 * [modalgallery ギャラリー機能]
 * @constructor
 * @param {String} options 引数を格納するオブジェクト
 * @param {String} targetID ギャラリーの親セレクタ
 * @param {String} $data ギャラリー表示する要素の情報を持ったDOMの集合
 */
suumo.krDetail.Modalgallery = function(options) {
	'use strict';

	var self = this;

	self.$target = $(options.targetID);
	self.id = self.$target.attr('id');
	self.selPrefix = '.' + self.id;
	self.$body = self.$target.find(self.selPrefix + '-body');
	self.$contents = self.$target.find(self.selPrefix + '-contents');
	self.$cassette = self.$target.find(self.selPrefix + '-cassette');

	self.$data = options.$data;
	self.maxIdx = self.$data.length - 1;
	self.currentIdx = null;
	self.$gallery = [];

	self.createGallery();
};

/**
 * [createGallery ギャラリー部生成]
 * @return {Void} 何も返さない
 */
suumo.krDetail.Modalgallery.prototype.createGallery = function() {
	'use strict';

	var self = this, dataPrefix;

	dataPrefix = 'data-' + self.id.replace('js-', '');
	self.$data.each(function() {
		var $cassette, $elem;

		$elem = $(this);
		$cassette = self.$cassette.clone();
		$cassette.find(self.selPrefix + '-title').text($elem.attr(dataPrefix + '-title'));
		$cassette.find(self.selPrefix + '-caption').html($elem.attr(dataPrefix + '-caption'));
		$cassette.find(self.selPrefix + '-image').attr('data-src', $elem.attr(dataPrefix + '-src'));

		self.$gallery.push($cassette);
	});

	self.$contents.html('');
	self.$gallery.forEach(function($elem) {
		self.$contents.append($elem);
	});
};

/**
 * [setGallery 指定のギャラリーページをセット]
 * @param {Number} idx 表示するギャラリーのindex
 * @return {Void} 何も返さない
 */
suumo.krDetail.Modalgallery.prototype.setGallery = function(idx) {
	'use strict';

	var self = this;

	if(self.currentIdx !== null) {
		self.$gallery[self.currentIdx].removeClass(suumo.krDetail.constants.ACTIVE_CLASS);
	}
	self.$gallery[idx].addClass(suumo.krDetail.constants.ACTIVE_CLASS);
	self.currentIdx = idx;
};

/**
 * [open ギャラリーを表示]
 * @param {object} options 引数を格納するオブジェクト
 * @param {Object} $elem クリックされた要素
 * @param {function} callback コールバック関数
 * @return {Void} 何も返さない
 */
suumo.krDetail.Modalgallery.prototype.open = function(options) {
	'use strict';

	var self = this, idx;

	// コンテンツ制御
	idx = Number(options.$elem.attr('data-modalgallery-id'));
	self.setGallery(idx);
	self.controlBtn(idx,self.maxIdx);
	// ギャラリー表示（アニメーション制御のため関数内でイベントハンドラーを記述）
	self.$target.addClass(suumo.krDetail.constants.ACTIVE_CLASS);
	setTimeout(function() {
		self.$target.addClass(suumo.krDetail.constants.OPEN_CLASS);
	}, 200);
	self.$target.bind('transitionend.modalgallery', function() {
		self.$target.unbind('transitionend.modalgallery');
		if(typeof options.callback === 'function') {
			options.callback.call(self.$gallery[self.currentIdx]);
		}
	});
};

/**
 * [close ギャラリーを閉じる]
 * @return {Void} 何も返さない
 */
suumo.krDetail.Modalgallery.prototype.close = function() {
	'use strict';

	var self = this;

	// ギャラリーを閉じる（アニメーション制御のため関数内でイベントハンドラーを記述）
	self.$target.bind('transitionend.modalgallery', function() {
		self.$target.unbind('transitionend.modalgallery');
		self.$target.removeClass(suumo.krDetail.constants.ACTIVE_CLASS);
	});
	self.$target.removeClass(suumo.krDetail.constants.OPEN_CLASS);
};

/**
 * [change 表示ギャラリーを変更]
 * @param {object} options 引数を格納するオブジェクト
 * @param {Number} idx 次に表示するギャラリーのindex
 * @param {function} callback コールバック関数
 * @return {Void} 何も返さない
 */
suumo.krDetail.Modalgallery.prototype.change = function(options) {
	'use strict';

	var self = this, count = 0;

	self.$body.bind('transitionend.modalgallery', function() {
		if(count === 0) {
			// ギャラリー切り替え
			count++;
			self.setGallery(options.idx);
			self.$body.addClass(suumo.krDetail.constants.OPEN_CLASS);
			return;
		}
		// ギャラリー切り替え後再表示完了
		self.$body.unbind('transitionend.modalgallery');
		if(typeof options.callback === 'function') {
			options.callback.call(self.$gallery[self.currentIdx]);
		}
	});
	self.$body.removeClass(suumo.krDetail.constants.OPEN_CLASS);
};

/**
 * [prev ギャラリーを１つ前に戻す]
 * @param {function} callback コールバック関数
 * @return {Void} 何も返さない
 */
suumo.krDetail.Modalgallery.prototype.prev = function(callback) {
	'use strict';

	var self = this, tmpIdx;

	tmpIdx = self.currentIdx - 1;
	if(tmpIdx < 0) {
		tmpIdx = self.maxIdx;
	}
	self.controlBtn(tmpIdx,self.maxIdx);
	self.change({
		idx: tmpIdx,
		callback: callback
	});
};

/**
 * [next ギャラリーを１つ次に進める]
 * @param {function} callback コールバック関数
 * @return {Void} 何も返さない
 */
suumo.krDetail.Modalgallery.prototype.next = function(callback) {
	'use strict';

	var self = this, tmpIdx;

	tmpIdx = self.currentIdx + 1;
	if(tmpIdx > self.maxIdx) {
		tmpIdx = 0;
	}
	self.controlBtn(tmpIdx,self.maxIdx);
	self.change({
		idx: tmpIdx,
		callback: callback
	});
};

/**
 * [next ギャラリーのボタンを制御]
 * @param {Number} curr 表示中のギャラリーのindex
 * @param {Number} max 最後のギャラリーのindex
 * @return {Void} 何も返さない
 */
suumo.krDetail.Modalgallery.prototype.controlBtn = function(curr,max) {
	'use strict';
	var idx = curr;

	if (Number(idx) === 0 && max !== 0) {
		$(".js-modalgallery-prev").attr("style","visibility:hidden");
		$(".js-modalgallery-next").attr("style","visibility:visible");
	} 
	if (Number(idx) === 0 && max === 0){
		$(".js-modalgallery-prev").attr("style","visibility:hidden");
		$(".js-modalgallery-next").attr("style","visibility:hidden");
	}
	if (Number(idx) !== 0 && Number(idx) !== max){
		$(".js-modalgallery-prev").attr("style","visibility:visible");
		$(".js-modalgallery-next").attr("style","visibility:visible");
	} 
	if (Number(idx) === max && max !== 0){
		$(".js-modalgallery-prev").attr("style","visibility:visible");
		$(".js-modalgallery-next").attr("style","visibility:hidden");
	}

};

/**
 * [slideUpDown よく使うアニメーションのエイリアス]
 * @param  {[String]} opt_target アニメーションさせるDOM.
 * @param  {[Number]} opt_sec    ミリ秒.
 * @param  {[String]} opt_ease   イージング.
 * 例:suumo.krDetail.slideUpDown('js-anime', '100', 'swing'); .
 */
suumo.krDetail.slideUpDown = function (opt_target, opt_sec, opt_ease) {
	var $target = opt_target;
	$target.animate({
		'opacity': 'toggle',
		'height': 'toggle',
		'padding-top': 'toggle',
		'padding-bottom': 'toggle'
	}, opt_sec, opt_ease);
};

/**
 * [changeText ボタンの文字列制御]
 * @param  {Object} $target  対象のDOM
 * @param  {String} $targetText 対象ボタン
 */
suumo.krDetail.changeText = function (target, text) {
	'use strict';

	var $target = $(target);
	var $targetText = $target.find(text);

	// is-activeが付いているか判定
	if ($target.hasClass(suumo.krDetail.constants.ACTIVE_CLASS)) {
		$targetText.text($target.attr('data-addtext'));
		$target.removeClass(suumo.krDetail.constants.ACTIVE_CLASS);
	} else {
		$targetText.text($target.attr('data-removetext'));
		$target.addClass(suumo.krDetail.constants.ACTIVE_CLASS);
	}
};

/**
 * [getReserveData 予約枠データの取得]
 * @param {Function} successCb 成功時のコールバック
 * @param {Function} failCb 失敗時のコールバック
 * @return {Void} 何も返さない
 */
suumo.krDetail.getReserveData = function(successCb, failCb) {
	'use strict';

	var apiUrl = $('#js-get_calendar_data_api').val();

	$.ajax({
		type: "GET",
		url: apiUrl,
		cache: false,
		dataType: 'json',
		timeout: 5000,
		success: function(json) {
			successCb(json);
		},
		error: function() {
			failCb();
		}
	});
};

/**
 * [CalendarCarousel 予約カレンダーカルーセル]
 * @param {Object} options 各種要素
 * @param {String} options.wrapper 表示枠指定要素のクラス
 * @param {String} options.content カルーセル表示可能枠内コンテンツのクラス
 * @param {String} options.prev 前へボタンのクラス
 * @param {String} options.next 次へボタンのクラス
 * @return {Void} 何も返さない
 */
suumo.krDetail.CalendarCarousel = function(options) {
	'use strict';

	var self = this;

	self.wrapper = options.wrapper;
	self.content = options.content;
	self.prev = options.prev;
	self.next = options.next;
	self.reservationFormUrl = $('#js-reservation_form_url').val();
	self.apiUrl = $('#js-get_calendar_data_api').val();

	// カレンダーデータjson変換用
	// 曜日
	self.weekdayList = [
		"日",
		"月",
		"火",
		"水",
		"木",
		"金",
		"土"
	];
	// アイコン
	self.statusData = {
		TEL: {
			icon: "is-tel",
			text: "TEL"
		},
		IMMEDIATE: {
			icon: "is-immediate",
			text: "即時予約"
		},
		TEMPORARY: {
			icon: "is-temporary",
			text: "仮予約"
		},
		UNAVAILABLE: {
			icon: "is-unavailable",
			text: "空きなし"
		},
		CLOSED: {
			icon: "is-closed",
			text: "予約不可"
		},
	};
};

/**
 * [moveTo 予約カレンダーカルーセルの移動]
 * @param {String} direction 移動方向
 * @param {HTMLElement} $carousel カルーセルの親要素
 * @param {HTMLElement} $target クリックした要素
 * @return {Void} 何も返さない
 */
suumo.krDetail.CalendarCarousel.prototype.moveTo = function(direction, $carousel, $target) {
	'use strict';

	var self = this;

	var $content = $carousel.find(self.content);
	var $prev = $carousel.find(self.prev);
	var $next = $carousel.find(self.next);
	var width = $carousel.find(self.wrapper).outerWidth();
	var moveToNum = direction === 'next' ? -1 : 0;
	var moveTo = (width - 1) * moveToNum;

	$content.css('transform', 'translateX(' + moveTo + 'px)');
	$prev.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
	$next.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
	$target.addClass(suumo.krDetail.constants.INACTIVE_CLASS);
};

/**
 * [formatJson 予約カレンダーデータを表示処理用に構造を変更]
 * @param {Object} calendarJson 取得したカレンダーデータ
 * @return {Array} 表示用の変換したカレンダーデータ
 */
suumo.krDetail.CalendarCarousel.prototype.formatJson = function(calendarJson) {
	'use strict';

	var self = this;
	var reservationType = calendarJson.reservation_type;

	return [
		calendarJson.date_list1.map(function(data) {
			return {
				...data,
				wdayText: self.weekdayList[data.wday],
				colorClass: data.color === '3' ? 'is-red' : data.color === '2' ? 'is-blue' : "",
				statusIcon: data.status === 'AVAILABLE' ? self.statusData[reservationType].icon : self.statusData[data.status].icon,
				statusText: data.status === 'AVAILABLE' ? self.statusData[reservationType].text : self.statusData[data.status].text
			};
		}),
		calendarJson.date_list2.map(function(data) {
			return {
				...data,
				wdayText: self.weekdayList[data.wday],
				colorClass: data.color === '3' ? 'is-red' : data.color === '2' ? 'is-blue' : "",
				statusIcon: data.status === 'AVAILABLE' ? self.statusData[reservationType].icon : self.statusData[data.status].icon,
				statusText: data.status === 'AVAILABLE' ? self.statusData[reservationType].text : self.statusData[data.status].text
			};
		}),
	];
};

/**
 * [showCalendar 予約カレンダーデータを表示]
 * @param {Array} weeklyCalendarData 表示用に変換したカレンダーデータ
 * @return {Void} 何も返さない
 */
suumo.krDetail.CalendarCarousel.prototype.showCalendar = function(weeklyCalendarData) {
	'use strict';

	var self = this;
	var $carouselContent = $(self.content);
	var $carouselNextButton = $(self.next);

	$carouselContent.empty();

	// カレンダー作成・挿入
	weeklyCalendarData.forEach(function(weeklyData) {
		var weeklyDom = '';
		weeklyData.forEach(function(dateData) {
			if (dateData.status === 'AVAILABLE') {
				weeklyDom += `
					<li class="schedule-item">
						<a class="schedule-item_container ${dateData.colorClass}" href="${self.reservationFormUrl}&date=${dateData.date}">
							<div class="schedule-header">${dateData.wdayText}</div>
							<div class="schedule-contents">
								<div class="schedule-date">${dateData.disp_date}</div>
								<div class="schedule-status ${dateData.statusIcon}"><span class="schedule-status_text">${dateData.statusText}</span></div>
							</div>
						</a>
					</li>
				`;
			} else {
				weeklyDom += `
					<li class="schedule-item">
						<div class="schedule-item_container is-inactive ${dateData.colorClass}">
							<div class="schedule-header">${dateData.wdayText}</div>
							<div class="schedule-contents">
								<div class="schedule-date">${dateData.disp_date}</div>
								<div class="schedule-status ${dateData.statusIcon}"><span class="schedule-status_text">${dateData.statusText}</span></div>
							</div>
						</div>
					</li>
				`;
			}
		});
		$carouselContent.append(`<ul class="schedule-list">${weeklyDom}</ul>`);
	});

	// カレンダーコンテンツ表示
	$carouselContent.removeClass(suumo.krDetail.constants.LOADING_CLASS);
	$carouselNextButton.removeClass(suumo.krDetail.constants.INACTIVE_CLASS);
};

//
// controller
//
suumo.krDetail.scrollLazy({
	className: 'js-scrollLazy'
});

$(window).load(function() {
	suumo.krDetail.scrollLazy({
		className: 'js-scrollLazy'
	});

	// 予約枠データの取得
	suumo.krDetail.getReserveData(function(result) {
		// データ取得成功時
		// 予約カレンダー処理
		suumo.krDetail.ifExists.dom($('.js-calendar_container'), function() {
			var carousel = new suumo.krDetail.CalendarCarousel({
				wrapper: '.js-carousel_wrapper',
				content: '.js-carousel_content',
				prev: '.js-carousel_prev',
				next: '.js-carousel_next'
			});

			var weeklyCalendarData = carousel.formatJson(result);
			carousel.showCalendar(weeklyCalendarData);
			// 予約カレンダーカルーセルの操作イベント付与
			$('.js-carousel').each(function() {
				var $carousel = $(this);
				var $prev = $carousel.find('.js-carousel_prev');
				var $next = $carousel.find('.js-carousel_next');

				$prev.bind('click', function() {
					carousel.moveTo('prev', $carousel, $(this));
				});

				$next.bind('click', function() {
					carousel.moveTo('next', $carousel, $(this));
				});
			});
		});

		// CTAボタン表示切り替え処理
		if (result.reservation_type === 'IMMEDIATE') {
			$('.js-cta_button').addClass(suumo.krDetail.constants.IMMEDIATE_CLASS);
		}

	}, function() {
		// データ取得失敗時
		$('.js-calendar_container').addClass(suumo.krDetail.constants.INACTIVE_CLASS);
		return false;
	});
})
.bind('scroll.lazy', function() {
	suumo.krDetail.scrollLazy({
		className: 'js-scrollLazy'
	});
});

suumo.krDetail.ifExists.dom($('#js-lightbox'), function() {
	var $mainImageLightbox = this;
	var mainImageLightbox;

	// Lightboxクラスのインスタンス化
	mainImageLightbox = new suumo.krDetail.Lightbox({
		$container: $mainImageLightbox,
		item: '.js-lightboxItem'
	});

	$mainImageLightbox
		.find('.js-lightboxItem')
			.live('click', function() {
				var self = this;

				mainImageLightbox.open($(self).attr('data-id'));

				return false;
			});

	$(document)
		.find('.js-lightbox-close')
			.live('click', function() {
				mainImageLightbox.close();
			}).end()
		.find('.js-lightbox-prev')
			.live('click', function() {
				mainImageLightbox.moveTo(Number(mainImageLightbox.getCurrentIndex()) - 1);
			}).end()
		.find('.js-lightbox-next')
			.live('click', function() {
				mainImageLightbox.moveTo(Number(mainImageLightbox.getCurrentIndex()) + 1);
			}).end()
		.find('.js-noContextMenu')
			.live('contextmenu', function() {
			return false;
		});
});

suumo.krDetail.ifExists.dom($('#js-themeimage'), function() {
	var $target, $lazyObject, scrollTrigger, gallery, $modalgallery;
	$target = this;

	// レイジーロード機能
	$lazyObject = $target.find('.js-lazyimage');
	scrollTrigger = new suumo.krDetail.ScrollTrigger();

	// スクロールタスク設定
	$lazyObject.each(function() {
		// 監視タスク追加
		scrollTrigger.addTask({
			triggerElement: this,
			callback: function() {
				suumo.krDetail.lazyload({
					targetID: this
				});
			}
		});
	});

	// スクロール監視開始
	scrollTrigger.watch();

	// ギャラリー機能
	$modalgallery = $('#js-modalgallery');
	gallery = new suumo.krDetail.Modalgallery({
		targetID: $modalgallery,
		$data: $target.find('.js-themeimage-gallery')
	});

	$target.find('.js-themeimage-gallery').bind('click', function(evt) {
		gallery.open({
			$elem: $(this),
			callback: function() {
				var $lazy;
				$lazy = this.find('.js-modalgallery-image').parent();
				if($lazy.hasClass(suumo.krDetail.constants.LOADED_CLASS)) {
					return;
				}
				suumo.krDetail.lazyload({
					targetID: $lazy
				});
			}
		});
		evt.preventDefault();
	});

	$modalgallery.find('.js-modalgallery-close').live('click', function(evt) {
		gallery.close();
		evt.preventDefault();
	});
	$modalgallery.find('.js-modalgallery-prev').live('click', function(evt) {
		gallery.prev(function() {
			var $lazy;
			$lazy = this.find('.js-modalgallery-image').parent();
			if($lazy.hasClass(suumo.krDetail.constants.LOADED_CLASS)) {
				return;
			}
			suumo.krDetail.lazyload({
				targetID: $lazy
			});
		});
		evt.preventDefault();
	});
	$modalgallery.find('.js-modalgallery-next').live('click', function(evt) {
		gallery.next(function() {
			var $lazy;
			$lazy = this.find('.js-modalgallery-image').parent();
			if($lazy.hasClass(suumo.krDetail.constants.LOADED_CLASS)) {
				return;
			}
			suumo.krDetail.lazyload({
				targetID: $lazy
			});
		});
		evt.preventDefault();
	});

	// 画像右クリック抑制
	$target.find('.js-lazyimage').bind('contextmenu', function(evt) {
		evt.preventDefault();
	});
	$modalgallery.find('.js-modalgallery-image').live('contextmenu', function(evt) {
		evt.preventDefault();
	});
});

suumo.krDetail.ifExists.dom($('#js-themeimage_upper'), function() {
	'use strict';

	var $target, tab;
	$target = this;

	// tab機能
	tab = new suumo.krDetail.Tab({
		targetID: $target,
		tabSelector: '.js-tab',
		contentsSelector: '.js-tab-contents'
	});

	// タブ制御
	$target.find('.js-tab').bind('click', function(evt) {
		tab.change($(this));
		evt.preventDefault();
	});
});

suumo.krDetail.ifExists.dom($('#js-themeimage_lower'), function() {
	'use strict';

	var tab;

	// tab機能
	tab = new suumo.krDetail.Tab({
		targetID: this,
		tabSelector: '.js-tab',
		contentsSelector: '.js-tab-contents'
	});

	// タブ制御
	this.find('.js-tab').bind('click', function(evt) {
		tab.change($(this));
		evt.preventDefault();
	});
});

// アコーディオン
suumo.krDetail.ifExists.dom($('.js-acc_item', function() {
	'use strict';

	var $this = $(this);
	var mainContents = $('#mainContents');
	var acc = new suumo.krDetail.Accordion({
		$container: mainContents,
		accordion: '.js-acc_item'
	});

	$this.find('.js-acc_trigger').bind('click', function(evt) {
		var $target = $(this).closest('.js-acc_item');
		acc.switch($target);
		evt.preventDefault();
	});
}));

// ドリルダウンリンクの制御
suumo.krDetail.ifExists.dom($('#js-accordion', function() {
	'use strict';

	// ロード時の処理
	suumo.krDetail.changeText('.js-accordion_btn', '.js-accordion_btn-text');
	$('.js-accordion_panel').css('display','none');

	// クリック時の処理
	$(this).find('.js-accordion_btn').bind('click', function() {
		suumo.krDetail.changeText('.js-accordion_btn','.js-accordion_btn-text');
		suumo.krDetail.slideUpDown($('.js-accordion_panel'), '200', 'swing');
	});
}));
