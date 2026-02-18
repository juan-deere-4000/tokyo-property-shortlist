<!--getKaisha -->
function getKaisha(rsid , type){

	var kaisha ="";

	if (rsid == "BB"){

		kaisha = "JJ" + type;

	} else if (rsid == "FR"){

		account = "FR" + type;

	} else if (rsid == "GR"){

		kaisha = type;
		account = "GR" + type;

	}

	return kaisha;
}
<!--editProductsParam -->
function editProductsParam(param, rsid, type, seikyuFlg) {

	if (seikyuFlg == "1") {
		return editSeikyuProductParam(param, rsid, type);
	} else {
	}

	var word = "";

	if (param instanceof Array) {
		//配列の場合
		for(i = 0; i < param.length; i++) {
			if (i==0){
				word = ";" + param[i]
			} else {
				word = word + param[i]
			}
			if (param[i + 1] != undefined) {
				word = word + ",;"
			}
		}
	} else {
		//普通のオブジェクトの場合
		word = ";" + param;
	}

	return word;
}
<!--addParam -->
function addParam(param,value) {

	if (param != undefined) {
		param = param + "_" + value;
	} else {
		param = value;
	}
	return param;

}


//特定状況下のs.products変数を編集する関数
//anotherProducts内に値が入っていた時は、s.productsの参照先をbcからでは無く、anotherProductsから取得する。
function editAnProductParam(param, ar, anParam) {

	if ((anParam != undefined && anParam != "")
		&& ar == "030") {
		return anParam;
	}
	return param;
}

//資料請求完了画面のs.products変数を編集する関数
function editSeikyuProductParam(param, rsid, type) {

	var word = ";";
	var point = bsPoint(getAreaType(rsid, type));

	if (param instanceof Array) {
		//配列の場合（2件以上の場合）
		for(i = 0; i < param.length; i++) {
			word = word + param[i] + ";" + "1;" + point;
			if (param[i + 1] != undefined) {
				word = word + ";";
			}
		}
	} else {
		//普通のオブジェクトの場合（1件の場合）
		word = word + param + ";" + "1;" + point;
	}

	return word;
}

//getAccout関数を元に、エリアタイプを生成、コードにする関数
//領域が増えた場合、こちらのコード生成分を増やせばいいので
//本元のgetAccount関数にも流用可
function getAreaType(rsid , type){

	var account ="";

	if (rsid == "BB"){

		if (type == "010"){

			account = "01";
		}else {

			account = "02";
		}
	} else if (rsid == "FR"){

		account = "03";
	} else if (rsid == "CH"){

		account = "04";
	} else if (rsid == "GR"){

		account = "05";
	} else if (rsid == "BI"){

		account = "06";
	} else if (rsid == "CM"){

		account = "07";
	}

	return account;
}


//エリアタイプに応じた点数を返す関数
function bsPoint(area) {
	switch (area) {
		case '01':
			return "30000";
			break;
		case '02':
		    return "45000";
			break;
		case '03':
			return "6000";
			break;
		case '04':
			return "6000";
			break;
		case '05':
			return "14000";
			break;
		default:
		    return ""
			break;
	}
}

function editShiryoParam( bc , nc , tjh , jjh , kc , seq , rsid , shiryoId , seikyuFlg, ar, bs ) {
	var param = "";

	if ( shiryoId == "10" )  {
		param = editProductsParam (nc , rsid , bs,seikyuFlg);
/*
		if( ar == "030" )  {
			if ( tjh != "")  {
				// tjh をセット
				param = editProductsParam (tjh , rsid , bs,seikyuFlg);
			} else if ( jjh != "")  {
				// jjh をセット
				param = editProductsParam (jjh , rsid , bs,seikyuFlg);
			} else {
			// nc をセット
				param = editProductsParam (nc , rsid , bs,seikyuFlg);
			}
		} else {
			 // param = bc です。
				param = editProductsParam (bc , rsid , bs,seikyuFlg);
		}
*/
	} else if ( shiryoId == "20") {
		// bc をセット
		param = editProductsParam (bc , rsid , bs,seikyuFlg);
	} else if ( shiryoId == "30") {
		if ( seq != "") {
		// seq をセット
		param = editProductsParam (seq , rsid , bs,seikyuFlg);
		} else {
		//KC をセット
		param = editProductsParam (kc , rsid , bs,seikyuFlg);
		}
	} else if ( shiryoId == "40") {
		// KC をセット
		param = editProductsParam (kc , rsid , bs,seikyuFlg);
	} else if ( shiryoId == "50") {
		// KC をセット
		param = editProductsParam (kc , rsid , bs,seikyuFlg);
	}

	return param;
}

function getShiryoId(ss, bs) {
	//alert(bs);

	if(ss == "010") {
		if(bs == "010") {
			return "10";
		} else {
			return "20";
		}
	} else if(ss == "020" || ss == "021" || ss == "022" ) {
		return "30";
	} else if(ss == "030") {
		return "40";
	} else if(ss == "031") {
		return "50";
	} else if(ss == "012") {
		return "70";
	} else if(bs == "010" || bs == "011" || bs == "020" || bs == "021" || bs == "030"){
		return "10";
	} else if(bs == "100"){
		return "60";
	} else {
		return "";
	}
}

function getPageName(shiryoId) {
	//alert(shiryoId);

	if(shiryoId == '10') {
		return "jxxxG30y";
	} else if(shiryoId == '20') {
		return "jxxxG30y";
	} else if(shiryoId == '30') {
		return "j050G53y";
	} else if(shiryoId == '40') {
		return "j050G33y";
	} else if(shiryoId == '50') {
		return "j050G43y";
	} else if(shiryoId == '60') {
		return "j050G30y";
	} else if(shiryoId == '70') {
		return "jxxxN30y";
	} else {
		return "";
	}


}

/**
 * VOSコード編集
 *
 * @param areaCd エリアコード
 * @param areaCd2
 * @param areaCd3
 * @param bukkenShuCd 物件種別コード
 * @param projectCd
 * @param bukkenCd
 * @param trace_p 元のVOSコード
 * @return 編集後VOSコード
 */
function editVOSCode(areaCd, areaCd2, areaCd3, bukkenShuCd, projectCd, bukkenCd, trace_p) {

	if (areaCd != undefined && areaCd != null && areaCd != "") {
	} else if (areaCd2 != undefined && areaCd2 != null && areaCd2 != "") {
		areaCd = areaCd2;
	}

	if (trace_p != undefined && trace_p != null && trace_p.length == 8) {
		if ("xxx" == trace_p.substring(1, 4)) {
			if (bukkenShuCd != undefined && bukkenShuCd != null && bukkenShuCd != "") {
				trace_p = trace_p.replace("xxx", bukkenShuCd);
			} else {
				if (trace_p == "jxxxG30y"){
					trace_p = trace_p.replace("xxx", "050");
				}
			}
		}
	}
	if (trace_p != undefined && trace_p != null && "y" == trace_p.slice(-1)) {
		if (areaCd == undefined || areaCd == null || areaCd == "") {
			if (projectCd != undefined && projectCd != null && 3 < projectCd.length) {
				areaCd = projectCd.substring(0, 3);
			} else if (bukkenCd != undefined && bukkenCd != null && 3 < bukkenCd.length) {
				areaCd = bukkenCd.substring(0, 3);
			}
		}
		if (areaCd != undefined && areaCd != null && areaCd != "") {
			trace_p = trace_p.replace("y", areaCd.substring(1, 2));
		} else if (areaCd3 != undefined && areaCd3 != null && areaCd3 != "") {
			trace_p = trace_p.replace("y", areaCd3.substring(1, 2));
		} else {
			trace_p = trace_p.replace("y", "0");
		}
	}
	return trace_p;
}

function getAreaCd(products, pageName) {
	if (pageName != undefined && pageName != null && 3 < pageName.length) {
		var pageKind = pageName.substring(0, 4);
		if (pageKind == "f351" || pageKind == "g501" || pageKind == "g503" ) {
		} else {
			if (products != undefined && products != null) {
				if (products instanceof Array) {
					products = products[0];
				}
				if (products != undefined && products != null && 3 < products.length) {
					return products.substring(0, 3);
				}
			}
		}
	}
	return;
}

function editEvents(bs, events) {

	var dest = events;
	if (events != undefined && events != null && events != ""
		&& bs != undefined && bs != null && bs != "") {

		if (-1 < events.indexOf("eventA")) {

			if (bs == "011") {
				dest = events.replace("eventA", "event5");
			} else if (bs == "020") {
				dest = events.replace("eventA", "event3");
			} else if (bs == "021") {
				dest = events.replace("eventA", "event4");
			} else if (bs == "030") {
				dest = events.replace("eventA", "event6");
			}

		} else if (-1 < events.indexOf("eventB")) {

			if (bs == "010") {
				dest = events.replace("eventB", "event9");
			} else if (bs == "011") {
				dest = events.replace("eventB", "event9");
			} else if (bs == "020") {
				dest = events.replace("eventB", "event7");
			} else if (bs == "021") {
				dest = events.replace("eventB", "event8");
			} else if (bs == "030") {
				dest = events.replace("eventB", "event10");
			}

		} else if (-1 < events.indexOf("eventC")) {

			if (bs == "010") {
				dest = events.replace("eventC", "event14");
			} else if (bs == "011") {
				dest = events.replace("eventC", "event14");
			} else if (bs == "020") {
				dest = events.replace("eventC", "event12");
			} else if (bs == "021") {
				dest = events.replace("eventC", "event13");
			} else if (bs == "030") {
				dest = events.replace("eventC", "event15");
			}

		} else if (-1 < events.indexOf("eventD")) {

			if (-1 < (location.hostname).indexOf("bridal.suumo.jp")) {
				dest = events.replace("eventD", "event19");
			} else if (-1 < (location.hostname).indexOf("gakusei.suumo.jp")) {
				dest = events.replace("eventD", "event20");
			}

		}
	}
	if (events != undefined && events != null && events != "" && -1 < events.indexOf("eventE")) {
		var strTmp = "";
		var splitEvents = events.split(",");
		for (var i = 1; i < splitEvents.length; i++) {
			var splitEvent = splitEvents[i].split("_");
			if (splitEvent[0] == "010") {
				if (splitEvent[1] == "N020" && -1 == strTmp.indexOf("event14")) {
					if(strTmp.length>0){strTmp += ",";}
					strTmp += "event14";
				} else if (-1 == strTmp.indexOf("event2")) {
					if(strTmp.length>0){strTmp += ",";}
					strTmp += "event2";
				}
			} else if (splitEvent[0] == "011" && -1 == strTmp.indexOf("event14")) {
				if(strTmp.length>0){strTmp += ",";}
				strTmp += "event14";
			} else if (splitEvent[0] == "020" && -1 == strTmp.indexOf("event12")) {
				if(strTmp.length>0){strTmp += ",";}
				strTmp += "event12";
			} else if (splitEvent[0] == "021" && -1 == strTmp.indexOf("event13")) {
				if(strTmp.length>0){strTmp += ",";}
				strTmp += "event13";
			} else if (splitEvent[0] == "030" && -1 == strTmp.indexOf("event15")) {
				if(strTmp.length>0){strTmp += ",";}
				strTmp += "event15";
			} else if (splitEvent[0] == "040" && -1 == strTmp.indexOf("event17")) {
				if(strTmp.length>0){strTmp += ",";}
				strTmp += "event17";
			}
		}
		dest = strTmp;
	}

	return dest;
}

/** ドメインとサイト区分の対応表 */
var SITE_KBN_MAP = {
    "suumo.jp":"01",
    "bridal.suumo.jp":"01",
    "gakusei.suumo.jp":"01",
    "forrentstyle.suumo.jp":"01",
    "forrent.jp":"04",
    "bridal.forrent.jp":"04",
    "heyanavi.com":"04",
    "isize.jutakujoho.jp":"02",
    "jj-navi.com":"03",
    "gakunavi.suumo.jp":"01",
    "ch-kskensaku.suumo.jp":"01",
    "ch-hrkensaku.suumo.jp":"01",
    "inaka.suumo.jp":"01",
    "bessou.suumo.jp":"01",
    "resort-net.com":"05",
    "housingnavi.jp":"06",
    "goodreform.jp":"07",
    "heyasagashiweb.com":"04",
    "gesyukusagashi.com":"04",
    "oneroomnavi.com":"04",
    "shinseikatsu.jp":"04",
    "shikikin0.com":"04",
    "daigakuchintai.com":"04",
    "gakuseikaikannavi.com":"04",
    "gakuseimansionnavi.com":"04",
    "eco.suumo.jp":"01",
    "jj.jp.msn.com":"08",
    "msn.suumo.com":"08",
    "campus.suumo.jp":"01",
    "iesagashi.suumo.jp":"01",
    "nikkei-suumo.jp":"10",
    "www.homepro.co.jp":"01",
    "kaigo.suumo.jp":"01",
    "jimoto.suumo.jp":"01",
    "house-service.suumo.jp":"01"
};

/** デフォルトサイト区分. */
var DEFAULT_SITE_KBN = "01";

/**
 * サイト区分取得.
 *
 * 現在のURLのホスト名に含まれているドメインに対応するサイト区分を返します。
 * ドメインとサイト区分の関係はSITE_KBN_MAPに定義します。
 * ドメインに対応するサイト区分が存在しなかった場合、
 * デフォルトサイト区分を返します。
 *
 * @return サイト区分
 */
function getSiteKbn() {
    var siteKbn = "";
    for( domain in SITE_KBN_MAP ) {
        if( isDomainContains( domain ) ) {
            siteKbn = SITE_KBN_MAP[domain];
        }
    }
    if( siteKbn == "" ) {
        siteKbn = DEFAULT_SITE_KBN;
    }
    return siteKbn;
}

/**
 * ドメイン存在確認.
 *
 * 現在のURLのホスト名に指定したドメインが含まれているかを確認します。
 * 含まれている場合は"true"、含まれていない場合は"false"を返します。
 *
 * @param domain 存在確認を行うドメイン
 * @return 確認結果
 */
function isDomainContains( domain ) {
    var isContains = false;
    var hostname = location.hostname;
    if( hostname.search( domain ) > -1 ) {
        isContains = true;
    }
    return isContains;
}


function getKskbn() {

    var domain = location.hostname;

    if(domain.search("forrentstyle.suumo.jp") != -1) {
        return "09";
    } else if(domain.search("ch-hrkensaku.suumo.jp") != -1) {
        return "05";
    } else if(domain.search("ch-kskensaku.suumo.jp") != -1) {
        return "04";
    } else if(domain.search("gakusei.suumo.jp") != -1
           || domain.search("heyanavi.com") != -1
           || domain.search("gakunavi.suumo.jp") != -1
           || domain.search("heyasagashiweb.com") != -1
           || domain.search("gesyukusagashi.com") != -1
           || domain.search("oneroomnavi.com") != -1
           || domain.search("shinseikatsu.jp") != -1
           || domain.search("shikikin0.com") != -1
           || domain.search("daigakuchintai.com") != -1
           || domain.search("gakuseikaikannavi.com") != -1
           || domain.search("gakuseimansionnavi.com") != -1) {
        return "03";
    } else if(domain.search("bridal.suumo.jp") != -1 || domain.search("bridal.forrent.jp") != -1) {
        return "02";
    } else if(domain.search("inaka.suumo.jp") != -1 ) {
        return "06";
    } else if(domain.search("bessou.suumo.jp") != -1 ) {
        return "07";
    } else if(domain.search("catalog.housingnavi.jp") != -1) {
        return "11";
    } else if(domain.search("import.housingnavi.jp") != -1) {
        return "12";
    } else if(domain.search("eco.suumo.jp") != -1 ) {
        return "10";
    } else if(domain.search("iesagashi.suumo.jp") != -1) {
        return "13";
    } else if(domain.search("campus.suumo.jp") != -1) {
        return "14";
    } else if(domain.search("jj-navi.com") != -1
           || domain.search("forrent.jp") != -1
           || domain.search("isize.jutakujoho.jp") != -1) {
        return "01";
    } else if(domain.search("kaigo.suumo.jp") != -1) {
        return "20";
    } else if(domain.search("jimoto.suumo.jp") != -1) {
        return "21";
    } else if(domain.search("house-service.suumo.jp") != -1) {
        return "22";
    }
}

<!--getPageName -->
function getFrPageName(pgn){

	var rtnPgn ="";

	var ksKbn = getKskbn();

	if (ksKbn == "01"  ||  ksKbn == null || ksKbn == ""){

		rtnPgn = pgn;

	} else {

		rtnPgn = ksKbn + "_" + pgn;

	}

	return rtnPgn;
}