var rsid = "CM";
var tb = "";

function setEditParam() {
	s.prop3 = s.pageName;
	s.prop15 = getCookie("ar");
	s.prop32 = getKskbn();
	s.prop33 = getSiteKbn();
	s.eVar15 = s.prop15;
	s.eVar32 = s.prop32;
	s.eVar33 = s.prop33;
}

/**
 * クッキーから値を取得する関数
 *
 * 引数のkeyに紐づく値を返します。
 *
 * @param key
 * @return keyに紐づく値
 */
function getCookie(key) {
	var tmp1 = " " + document.cookie + ";";
	var tmp2 = "";
	var xx1 = 0;
	var xx2 = 0;
	var len = tmp1.length;
	while (xx1 < len) {
		xx2 = tmp1.indexOf(";", xx1);
		tmp2 = tmp1.substring(xx1 + 1, xx2);
		xx3 = tmp2.indexOf("=");
		if (tmp2.substring(0, xx3) == key) {
			return (unescape(tmp2.substring(xx3 + 1, xx2 - xx1 -1)))
		}
		xx1 = xx2 + 1;
	}
	return ("");
}