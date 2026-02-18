/***********************************************************************
 * Suumo Archiveの名前空間
 ***********************************************************************/
var sa = sa || {};

/***********************************************************************
 * 変換系
 ***********************************************************************/
sa.conv = {
	defaultProtocol : "http:"
};

/**
 * 画像をリサイズさせる
 * @param def maxサイズオブジェクト {w:画像リサイズ幅、h:画像リサイズ高さ}
 * @param $img 画像DOMjQueryオブジェクト
 * @return サイズオブジェクト {w:画像リサイズ幅、h:画像リサイズ高さ}
 */
sa.conv.resizeImg = function(def, $img) {
	var h = def.height,
		w = def.width,
		ih = $img.height(),
		iw = $img.width();
	function calcW() {
		return {
			width : (iw / ih) * h, // 画像の縦横比から画像の幅を計算する
			height : h			   // 縦maxに合わせる
		};
	}
	function calcH() {
		return {
			width : w,				// 横maxに合わせる
			height : (ih / iw) * w	// 画像の縦横比から画像の高さを計算する
		};
	}

	// 差分がでかいほうがターゲット（同じ長さの場合対応）。差分が大きい方
	return  (h - ih > w - iw) ? calcH() : calcW();
}