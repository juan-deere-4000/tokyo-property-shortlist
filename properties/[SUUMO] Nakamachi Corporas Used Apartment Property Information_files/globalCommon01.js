/**
 * 共通ヘッダー、共通フッターで共通
 */
//ログイン、ログアウト
function doTurnback(url){
	var tnbkFrm = document.getElementById("turnbackPostForm");
	tnbkFrm.action = url;
	tnbkFrm.submit();
	return false;
}

//別ウィンドウ表示
function open_sub_window(object,target){
	SubWindow=window.open(object,target,"width=780,top=0,left=0,toolbar=1,location=1,status=1,menubar=1,scrollbars=1,resizable=1");
	SubWindow.focus();
}

//横断37 LKI 張 START
//リゾートタブウィンドウ表示
function open_sub_window_rs(object,target){
	SubWindow=window.open(object,target,"width=1250,height=7000,top=0,left=0,toolbar=1,location=1,status=1,menubar=1,scrollbars=1,resizable=1");
	SubWindow.focus();
}
//横断37 LKI 張 END

//webapp/jjcommon/js/rollover.jsからコピー
//各ボタンのマウスオーバー時の制御
function setRollovers(opts) {

	if (!opts) opts = {};
	opts.rolloverClass               = opts.rolloverClass              || 'imgover';
	opts.defaultRolloverImageSuffix  = opts.defaultRolloverImageSuffix || '_ov';

	var targetImageIdSuffixRe = new RegExp('_' + opts.rolloverClass + '$'); // 'id_imgover'

	setRolloversByTagName('img',   function(image) {return (true);                 });
	setRolloversByTagName('input', function(input) {return (input.type == 'image');});

	function setRolloversByTagName(targetTag, isRolloverObject) {
		var aImages = document.getElementsByTagName(targetTag); //like 'img', 'input',...
		for (var i = 0, n = aImages.length; i < n; i++) {
			var image = aImages[i];
			if (!image.className) continue;
			if (!getRolloverClass(image)) continue;
			if (!isRolloverObject(image)) continue;
			if (image.useMap) { // case of clickable map
				setRolloversClickableMap(image);
				continue; // next image
			}
			setRollover(image);
		}
	}

	function getRolloverClass(anObject) {
		var rolloverClassRe = new RegExp('^(' + opts.rolloverClass + ')(.*)');
		if (!anObject.className) return null;
		var classNames = anObject.className.split(' ');
		for (var i = 0, n = classNames.length; i < n; i++) {
			var classNameElements = classNames[i].match(rolloverClassRe);
			if (classNameElements) return classNameElements;
			// returns an array [class_full, class_base, class_extension]
		}
		return null;
	}

	function setRolloversClickableMap(image) {
		var mapId = image.useMap.match(/^\#(.*)/)[1]; // cut off the initial "#"
		var areas = document.getElementsByName(mapId).item(0).areas;
		for (var i = 0, n = areas.length; i < n; i++) {
			if (getRolloverClass(areas[i])) {
				setRollover(image, areas[i]);
			}
		}
	}

	function setRollover(targetImage, eventCaptureObject) {
		// if eventCaptureObject catch some mouseover/mouseout event,
		// then replace the image source of targetImage.
		var src = targetImage.src;
		var targetImageId = targetImage.getAttribute('id') || '';
		var eventCaptureId = (targetImageId.match(targetImageIdSuffixRe))
			? targetImageId.replace(targetImageIdSuffixRe, '')
			: '';

		eventCaptureObject
			= document.getElementById(eventCaptureId)
			|| eventCaptureObject
			|| targetImage;

		var rolloverImageSuffix = getRolloverClass(eventCaptureObject)[2] // _XX of imgover_XX
			|| opts.defaultRolloverImageSuffix;                       // _ov

		var ftype = src.substring(src.lastIndexOf('.'), src.length);
		var hsrc = src.replace(ftype, rolloverImageSuffix + ftype);
		var mouseoverImage = new Image();
		var mouseoutImage  = new Image();

		mouseoverImage.src = hsrc;	// preload mouseover image
		mouseoutImage.src  = src;	// save as mouseout image

		eventCaptureObject.onmouseover = function() {
			targetImage.src = hsrc;
		}

		eventCaptureObject.onmouseout = function() {
			targetImage.src = src;
		}
	}
} // /setRollover

//閲覧履歴一覧：画像サイズ調整
function adjustPosEx(image, borderW, borderH, imageW, imageH){
	$(image).parent().css("align","center");
	$(image).parent().css("vertical-align","top");
	if(imageH > 0 && imageH <= borderH){
		$(image).css("margin-top",(borderH - imageH) * 0.5);
	}
	if(imageW > 0 && imageW <= borderW){
		$(image).css("margin-left",(borderW - imageW) * 0.5);
	}
}



COMMON = {}


/**
 * 共通ヘッダー
 */
//各ボタンのマウスオーバー
$(function(){
	setRollovers();
});

//リゾートタブ
$("#nav_resort").click(function(){
	//横断37 LKI 張 START
	open_sub_window_rs('https://bessou.suumo.jp/','');
	//横断37 LKI 張 END
});

//delArCookie(《全国へ》リンク等)
function delArCookie(){
	COMMON.HEADER.delArCookie();
}
$("#delArCookie").click(function(){
	COMMON.HEADER.delArCookie();
});

//閲覧履歴一覧
$("#recommendIchiran").bind('mouseover',function(){
	var ar = $("#ar").val();
	var bs = $("#bs").val();

	if (COMMON.HEADER.overfunc()) return COMMON.HEADER.getResetLatestList(ar, bs,'3','1'); else return false;
});

var nop = function(){};
$.fn.pdmenu = function($menu) {
	var $this = $(this);
	$menu.hide();
	$this.hover(function(){$menu.show();}, function(){$menu.hide();});
	$menu.hover(function(){$menu.show();}, function(){$menu.hide();});
};

$(function(){
	$('#bt_list_clip').pdmenu($('#list_clip'));
	// 2014/7/4 賃貸サブサイト（ブライダル）マイバー改修 ID名変更
	$('#recommendIchiran').pdmenu($('#list_history'));
});

//横断検索テキストボックス
//jQuery.example
(function(A){A.fn.example=function(D,C){var B=A.extend({},A.fn.example.defaults,C);var E=A.isFunction(D);if(!A.fn.example.bound_class_names[B.class_name]){A(window).unload(function(){A("."+B.class_name).val("")});A("form").submit(function(){A(this).find("."+B.class_name).val("")});A.fn.example.bound_class_names[B.class_name]=true}return this.each(function(){var G=A(this);if(A.browser.msie&&!G.attr("defaultValue")&&(E?G.val()!="":G.val()==D)){G.val("")}if(G.val()==""){G.addClass(B.class_name);G.val(E?D.call(this):D)}if(B.hide_label){var F=A("label[for="+G.attr("id")+"]");F.next("br").hide();F.hide()}G.focus(function(){if(A(this).is("."+B.class_name)){A(this).val("");A(this).removeClass(B.class_name)}});G.blur(function(){if(A(this).val()==""){A(this).addClass(B.class_name);A(this).val(E?D.call(this):D)}})})};A.fn.example.defaults={class_name:"example",hide_label:false};A.fn.example.bound_class_names=[]})(jQuery);

//横断検索テキストボックスの文言
$('.js_exmple').example(function() {
	return $(this).attr('title');
});

//横断検索の検索ボタン
$('.wordSearch').click(function() {
	var wordSearchFrm = document.getElementById("wordSearch");
	wordSearchFrm.submit();
});


COMMON.HEADER = {
	overfunc: function(){
		if(COMMON.HEADER.submitted){
			return false;
		}else{
			COMMON.HEADER.submitted = true;
			return true;
		}
	},

	submitted : false ,

	//onclick系(delArCookie())
	delArCookie: function(){
		var date = new Date();
		date.setYear(date.getYear() - 1);
		var i = 0;
		while (-1 < document.cookie.indexOf("ar") & i++ < 10)
			document.cookie = "ar=;path=/ ;expires=" + date.toGMTString() + ";";
	},

	//閲覧履歴一覧
	getResetLatestList : function(ar, bs, dispmode,seino ) {
		$("#poplistBukken").html("<div >データを読み込み中・・・</div >");

		$.ajax({
			type:"POST",
			url :"/jj/common/parts/JJ901FI311/",
			data: "ar="+ ar + "&bs="+ bs + "&dispmode=" + dispmode + "&seinoflg=" + seino,
			success: function (msg) {
				$("#poplistSearch").html( msg );
			}
		});

		$.ajax({
			type:"POST",
			url :"/jj/common/parts/JJ901FI301/",
			data: "ar="+ ar + "&bs="+ bs + "&dispmode=" + dispmode,
			success: function (msg) {
				$("#poplistBukken").html( msg );

			}
		});

		return false;
	}
}
