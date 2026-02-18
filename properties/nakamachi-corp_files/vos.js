//stmt_pc.js  202507

var isDenyDomain___ = false;

//============ beacon start ==================================
var stmt_params={};
stmt_params.beacon_call_in_stmt = false;
var __vosFlg = false;
var vosCheckDomain = location.hostname;
if(vosCheckDomain.match(/^(wwwtst\.(k[0-9]?[0-9]\.)?)?suumo\.jp(\.suu\.raftel)?$/)
|| vosCheckDomain.match(/^(img01\.suumo|www\.officemovement)\.com$/)
|| vosCheckDomain.match(/^(wwwtst\.)?(bessou|bridal|business|campus|ch\-hrkensaku|codata|forrentstyle|gakunavi|gakusei|hikkoshi|inaka|journal|library|os_mansion|pet|plan\-search)\.suumo\.jp$/)){
	__vosFlg = true;
}
if(__vosFlg){
	stmt_params.beacon_call_in_stmt = true;

	(function(){
		var __beaconJsPath = '';
		if(location.host.match(/^(wwwtst.)/)){
			__beaconJsPath = 'wwwtst.';
		}

		var tagjs = document.createElement('script');
		var scr = document.getElementsByTagName('script')[0];
		tagjs.async = true;
		tagjs.src = '//' + __beaconJsPath + 'suumo.jp/front/tag/stmt/log_beacon.js';
		scr.parentNode.insertBefore(tagjs, scr);
	})();
}

//============ beacon end ==================================

//============ realtimelog start ==================================
var __realtimelogFlg = false;
if('SuumoPageData'in window && SuumoPageData && SuumoPageData.rtLog && SuumoPageData.rtLog.service_shubetsu_cd){
	if(SuumoPageData.rtLog.service_shubetsu_cd === '010' ||SuumoPageData.rtLog.service_shubetsu_cd === '011' ||SuumoPageData.rtLog.service_shubetsu_cd === '020' ||SuumoPageData.rtLog.service_shubetsu_cd === '021' ||SuumoPageData.rtLog.service_shubetsu_cd === '030' ||SuumoPageData.rtLog.service_shubetsu_cd === '040'){
		__realtimelogFlg = true;
	}
}
if(__realtimelogFlg){
	(function(){
		var __realtimelogJsPath = '';
		var kenpinHost = location.host.match(/^wwwtst\.(k[0-9]?[0-9]+\.)?/);
		if(kenpinHost && kenpinHost[0]){
			__realtimelogJsPath = kenpinHost[0];
		}

		var tagjs = document.createElement('script');
		var scr = document.getElementsByTagName('script')[0];
		tagjs.async = true;
		tagjs.src = '//' + __realtimelogJsPath + 'suumo.jp/front/tag/stmt/realtimelog.min.js';
		scr.parentNode.insertBefore(tagjs, scr);
	})();
}
//============ realtimelog end ====================================

//============ GTM start ==================================

//============ custom event function start ================================
var tagCustomEvent = function (id) {
	var tag_event_id = id || "";

	try {
		dataLayer.push({'event': tag_event_id}); //GTM
	}
	catch (e) {

	}
};
//============ custom event function end ==================================

var gtmContainerSelector = function(url)
{
	var matchList=function(text,list)
	{
		for(var i=0;i<list.length;i++)
		{
			if(text.match(list[i]))
			{
				return true;
			}
		}
		return false;
	};

	//Config
	var gtmInfo = [];

	//for Hontai - honban
	gtmInfo.push({'id':'GTM-PCHPZQBZ'
				,'matches':['^(bessou|gakusei|bridal|inaka|gakunavi|codata|library)?\\\.suumo\\\.jp/']
				,'exclusion':[]});
	//for Counter - honban
	gtmInfo.push({'id':'GTM-KSKNWCV'
				,'matches':['^www\\\.suumocounter\\\.jp/']
				,'exclusion':[]});
	//for JikaiJisui - honban
	gtmInfo.push({'id':'GTM-NLH8P7QH'
				,'matches':['^hikkoshi\\\.suumo\\\.jp/','^suumoreformstore\\\.jp/','^www\\\.suumo-onr\\\.jp/','^point\\\.recruit\\\.co\\\.jp/','^krs\\\.bz/rsc-gnpkfs']
				,'exclusion':[]});
	//for Reform - honban
	gtmInfo.push({'id':'GTM-NHV6H2J'
				,'matches':['^reform\\\.suumocounter\\\.jp/','^inquiry\\\.reform\\\.suumo\\\.jp/m/(?!.*test).*(\\\d)?(/)?$']
				,'exclusion':[]});
	//for Kr - honban			
	gtmInfo.push({'id':'GTM-PH83X8S'			
				,'matches':['^survey\\\.kr\\\.suumo\\\.jp/']
				,'exclusion':[]});
	//for JikaiJisui - kenpin
	gtmInfo.push({'id':'GTM-N3PP9TD4'
				,'matches':['^wwwtst\\\.hikkoshi\\\.suumo\\\.jp/','feature\\\d{4}\\\.qa\\\.hikkoshi\\\.suumo\\\.jp/','^stg(\\\d)?\\\.suumoreformstore\\\.jp/','suumo-onr\\\.jp/','krs\\\.bz/rsc-gnpkfs','point\\\.recruit\\\.co\\\.jp/','dev254-front\\\.apf\\\.e\\\.recruit\\\.co\\\.jp']
				,'exclusion':[]});
	//for Reform - kenpin
	gtmInfo.push({'id':'GTM-5RPC7LS'
				,'matches':['^wwwtst\\\.reform\\\.suumocounter\\\.jp/','^inquiry\\\.reform\\\.suumo\\\.jp/m/(?=.*test).*(\\\d)?(/)?$']
				,'exclusion':[]});
	//for Counter - kenpin
	gtmInfo.push({'id':'GTM-5KR6CT7'
				,'matches':['^wwwtst\\\.(k\\\d\\\.)?suumocounter\\\.jp/','^wwwtst\\\.(.*\\\.)?suumocounter\\\.jp/']
				,'exclusion':[]});
	//for Kr - kenpin			
	gtmInfo.push({'id':'GTM-M8H4KH7'			
				,'matches':['^k0\\\d\\\.dev\\\.survey\\\.kr\\\.suumo\\\.jp/']
				,'exclusion':[]});
	//for Hontai - kenpin
	gtmInfo.push({'id':'GTM-N7HQNVWD'
				,'matches':['^wwwtst\\\.(.*\\\.)?suumo\\\.jp/','^wwwtst\\\.suumo\\\.jp\\\.suu\\\.raftel/']
				,'exclusion':[]});
	//for Other
	gtmInfoOtherId = 'GTM-PCHPZQBZ';

	var id=gtmInfoOtherId;
	for(var i=0;i<gtmInfo.length;i++)
	{
		var isMatch=matchList(url,gtmInfo[i].matches);

		if(isMatch)
		{
			var isEx=matchList(url,gtmInfo[i].exclusion);
			if(!isEx)
			{
				id=gtmInfo[i].id;
				break;
			}
		}
	}

	if (id == 'GTM-N7HQNVWD' || id == 'GTM-PCHPZQBZ') {
		try {
			var honbanCheckFlag = false;
			if (id == 'GTM-PCHPZQBZ') {
				honbanCheckFlag = true;
			}

			var rf_reg = '/oyaku/(remodel|oyaku_category/remodel)/';

			if(new RegExp(rf_reg, 'i').test(location.pathname)){
				return getRFContainerIdFromLocationPathname(id, honbanCheckFlag);
			}

			if(typeof s.prop14 !== 'undefined' && s.prop14 != ''){
				return getContainerIdFromProp14(id, honbanCheckFlag, s.prop14);
			}
		} catch (e) {
		}
	}
	return id;
};

function getContainerIdFromProp14(id, honbanCheckFlag, prop14){
	switch (prop14) {
		case '600':
		case '601':
			if (honbanCheckFlag) {
				id = 'GTM-5HRH2J5'; // chumon - honban
			} else {
				id = 'GTM-WKVS5CZ'; // chumon - kenpin
			}
			break;
		case '040':
		case '041':
		case '301':
			if (honbanCheckFlag) {
				id = 'GTM-MFF3DNW'; // chintai - honban
			} else {
				id = 'GTM-WJDJ9G9'; // chintai - kenpin
			}
			break;
		case '010':
			if (honbanCheckFlag) {
				id = 'GTM-NWNDPNF'; // MS - honban
			} else {
				id = 'GTM-55RT3FC'; // MS - kenpin
			}
			break;
		case '051':
		case '052':
		case '053':
		case '054':
		case '055':
			if (honbanCheckFlag) {
				id = 'GTM-NHV6H2J'; // RF - honban
			} else {
				id = 'GTM-5RPC7LS'; // RF - kenpin
			}
			break;
		case '011':
		case '020':
		case '021':
		case '030':
			if (honbanCheckFlag) {
				id = 'GTM-PH83X8S'; // KR - honban
			} else {
				id = 'GTM-M8H4KH7'; // KR - kenpin
			}
			break;
		case '100':
			if (honbanCheckFlag) {
				id = 'GTM-NZZNMKF'; // baikyaku - honban
			} else {
				id = 'GTM-PZV2QHB'; // baikyaku - kenpin
			}
			break;
		default:
			break;
	}

	return id;
};

function getRFContainerIdFromLocationPathname(id, honbanCheckFlag){
	if (honbanCheckFlag) {
		id = 'GTM-NHV6H2J'; // RF - honban
	} else {
		id = 'GTM-5RPC7LS'; // RF - kenpin
	}

	return id;
};

var gtmContainerIds = gtmContainerSelector(location.hostname + location.pathname);
//GTM Code
<!-- Google Tag Manager -->
((navigator.userAgent.match(/\/SUUMO_APP/)) ? '':(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',gtmContainerIds));
<!-- End Google Tag Manager -->
//============ GTM end ==================================