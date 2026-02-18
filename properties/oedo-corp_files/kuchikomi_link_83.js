/**
 * @license Copyright (C) Recruit Co., Ltd.
 */

/**
 * [kuchikomi_link_kr KR物件詳細画面からマンションノート口コミ画面(物件用)へリンクする]
 * @param actionUrl クチコミ一覧画面へのアクションパス
 * @param ar エリアコード
 * @param bs 物件種別コード
 * @param nc プロジェクトコード
 * @param bnjChuKbn 分譲仲介区分
 */
function kuchikomi_link_kr(actionUrl,ar,bs,nc,bnjChuKbn){
	window.open( actionUrl + "?ar=" + ar + "&bs=" + bs + "&nc=" + nc + "&bnjChuKbn=" + bnjChuKbn, "_blank");
};
/**
 * [kuchikomi_link_fr 賃貸物件詳細画面からマンションノート口コミ画面(物件用)へリンクする]
 */
function kuchikomi_link_fr(){
	document.getElementById('js-kuchikomiFomeFr').submit();
};
/**
 * [kuchikomi_link_ms MS物件詳細画面からマンションノート口コミ画面(物件用)へリンクする]
 */
function kuchikomi_link_ms(){
	document.getElementById('js-kuchikomiFomeMs').submit();
};
