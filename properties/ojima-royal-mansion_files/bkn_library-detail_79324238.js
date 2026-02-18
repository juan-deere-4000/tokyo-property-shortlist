/**
 * @license Copyright (C) Recruit Sumai Company Ltd.
 */

/**
 * [suumo すべての基幹となるsuumoオブジェクト]
 * @type {Object}
 */
var suumo = suumo || {};

/**
 * [bknLibrary 物件ライブラリ用となる名前空間]
 * @namespace
 */
suumo.bknLibrary = suumo.bknLibrary || {};

// アコーディオンの開閉
suumo.bknLibrary.switchAccordion = function() {
  var $switchItem = $(this).parent().siblings('.accordion-item').not(':first');
  var accordionOpenDispay = $(this).children('.accordion--open').css('display');
  if (accordionOpenDispay == 'none') {
    $switchItem.addClass('is-hidden');
    $(this).children('.accordion--close').css('display', 'none');
    $(this).children('.accordion--open').css('display', 'block');
  } else {
    $switchItem.removeClass('is-hidden');
    $(this).children('.accordion--close').css('display', 'block');
    $(this).children('.accordion--open').css('display', 'none');
  }
}

// 交通情報−路線タブの切替
suumo.bknLibrary.switchRosenTab = function() {
  var $targetRosen = $(this);
  var $rosenTab = $targetRosen.parent().find('.rosen_info-nav_btn');
  var $switchItem = $targetRosen.parents('.js-rosenTab').find('.rosen_info-body_item');
  var targetNum = $rosenTab.index(this);
  $rosenTab.removeClass('is-active');
  $targetRosen.addClass('is-active');
  $switchItem.addClass('is-hidden');
  $switchItem.eq(targetNum).removeClass('is-hidden');
}

// 交通情報−スライダーのコンストラクタ
suumo.bknLibrary.StationSlider = function(options) {
  this.$wrapper = $(options.wrapper); // コンテナ
  this.$slider = 	this.$wrapper.find(options.slider); // スライダー本体
  this.$item = this.$slider.find(options.sliderItem); // スライドアイテム
  this.$prevButton = this.$wrapper.find(options.prevBtn); // 前へボタン
  this.$nextButton = this.$wrapper.find(options.nextBtn); // 次へボタン
  this.activeClassName = options.activeClassName; // カレントのクラス名
  this.$current = this.$item.filter('.' + this.activeClassName);
  this.speed = options.speed; // アニメーションの速度
  this.showItemCount = 7;
  this.itemLength = this.$item.length;
  this.itemWidth = this.$item.outerWidth(true);
  this.lrCount = (this.showItemCount - 1) / 2;
  this.model = {
    currentIndex: this.$current.index(),
    firstIndex: 0,
    lastIndex: 0,
    scrollLeft: 0
  };
};

// 交通情報−スライダーの初期設定
suumo.bknLibrary.StationSlider.prototype.init = function() {
  var self = this;

  if (self.itemLength < self.showItemCount) {
    self.$prevButton.add(self.$nextButton).hide();
    return;
  }

  var $prevItems = self.$current.prevAll();
  var $nextItems = self.$current.nextAll();

  if ($prevItems.length <= self.lrCount) {
    self.model.lastIndex = self.model.firstIndex + self.showItemCount - 1;
    self.$prevButton.hide();
  } else if ($nextItems.length <= self.lrCount) {
    self.model.lastIndex = self.itemLength - 1;
    self.model.firstIndex = self.model.lastIndex - self.showItemCount + 1;
    self.model.scrollLeft = self.itemWidth * (self.itemLength - self.showItemCount) * -1;
    self.$nextButton.hide();
  } else {
    self.model.firstIndex = self.model.currentIndex - self.lrCount;
    self.model.lastIndex = self.model.currentIndex + self.lrCount;
    self.model.scrollLeft = self.itemWidth * self.$item.eq(self.model.firstIndex).prevAll().length * -1;
  }

  self.setScrollLeft();
};

// 交通情報−前へボタン制御
suumo.bknLibrary.StationSlider.prototype.scrollPrev = function() {
  var self = this;

  var $prevItems = self.$item.eq(self.model.firstIndex).prevAll();
  var isPrevLengthOver = $prevItems.length > self.showItemCount;

  self.model.firstIndex = isPrevLengthOver ? self.model.firstIndex - self.showItemCount : 0;
  self.model.lastIndex = self.model.firstIndex + self.showItemCount - 1;
  self.model.scrollLeft = isPrevLengthOver ? self.model.scrollLeft - (self.itemWidth * self.showItemCount) * -1 : 0;
  self.setScrollLeft();
};

// 交通情報−次へボタン制御
suumo.bknLibrary.StationSlider.prototype.scrollNext = function() {
  var self = this;

  var $nextItems = self.$item.eq(self.model.lastIndex).nextAll();
  var isNextLengthOver = $nextItems.length > self.showItemCount;

  self.model.lastIndex = isNextLengthOver ? self.model.lastIndex + self.showItemCount : self.itemLength - 1;
  self.model.firstIndex = self.model.lastIndex - self.showItemCount + 1;
  self.model.scrollLeft = isNextLengthOver ? self.model.scrollLeft - (self.itemWidth * self.showItemCount) : self.model.scrollLeft - (self.itemWidth * $nextItems.length);
  self.setScrollLeft();
};

// 交通情報−アイテムセンタリング指定
suumo.bknLibrary.StationSlider.prototype.setScrollLeft = function() {
  var self = this;
  self.$slider.animate({ left: self.model.scrollLeft }, self.speed);
  if (self.model.firstIndex === 0) {
    self.$prevButton.hide();
  } else {
    self.$prevButton.show();
  }
  if (self.model.lastIndex === self.itemLength - 1) {
    self.$nextButton.hide();
  } else {
    self.$nextButton.show();
  }
};


// 交通情報−スライダー要素のバインド
suumo.bknLibrary.setStationSlider = function($target) {
  var sliderList = [];
  $target.each(function (index) {
    sliderList[index] = $(this).find('.js-rosenSliderWrapper');
  });
  var stationSlider = [];
  var sliderOption = {
    wrapper: '',
    slider: '.js-rosenSliderSlides',
    sliderItem: '.js-rosenSliderItem',
    prevBtn: '.js-rosenSliderPrev',
    nextBtn: '.js-rosenSliderNext',
    activeClassName: 'is-active',
    speed: 300
  };
  for (var i = 0; i < sliderList.length; i++) {
    $slider = sliderList[i];
    stationSlider[i] = [];
    for (var j = 0; j < $slider.length; j++) {
      sliderOption.wrapper = $slider[j];
      stationSlider[i].push(new suumo.bknLibrary.StationSlider(sliderOption));
      stationSlider[i][j].init();
    }
  }
  $target.each(function (kotsuIndex) {
    $(this).find(sliderOption.prevBtn).bind('click', function(e) {
      var index = $(e.currentTarget).closest('.js-rosenTabBody').index();
      stationSlider[kotsuIndex][index].scrollPrev();
    });
    $(this).find(sliderOption.nextBtn).bind('click', function(e) {
      var index = $(e.currentTarget).closest('.js-rosenTabBody').index();
      stationSlider[kotsuIndex][index].scrollNext();
    });
  });
}

// 非同期によるコンテンツに関するJS処理
window.addEventListener('load', function() {
  // 全ての「その他駅をもっと見る」ボタンのイベントを利用
  $('.js-accordion-trigger').bind('click', suumo.bknLibrary.switchAccordion);

  // 交通情報の路線切替イベントを利用
  $('.js-rosenTabBtn').bind('click', suumo.bknLibrary.switchRosenTab);

  // 交通情報イベントを利用
  suumo.bknLibrary.setStationSlider($('.js-rosenSlider'));

})
