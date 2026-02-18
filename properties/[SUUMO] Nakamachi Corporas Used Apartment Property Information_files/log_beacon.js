<!--
if(!isDenyDomain___){

	var _WkWkParams = _WkWkParams || [];
	var tempDomain = location.hostname;
	if(tempDomain.match(/^(www(tst|kc|adm)|r)\.|\.r\./)
	|| tempDomain.match(/\.suu\.raftel$/)){
		_WkWkParams.push(['DEVELOPER_DOMAIN', tempDomain]);
	}

	(function() {
		var _WkWkAllDenyPathList = [];
			_WkWkAllDenyPathList.push("/*");

		var _WkWkSuumoJpDenyPathList = [];
			_WkWkSuumoJpDenyPathList.push('/');
			_WkWkSuumoJpDenyPathList.push('/jj/*');
			_WkWkSuumoJpDenyPathList.push('/chintai/*');
			_WkWkSuumoJpDenyPathList.push('/mansion/*');
			_WkWkSuumoJpDenyPathList.push('/ms/*');
			_WkWkSuumoJpDenyPathList.push('/ikkodate/*');
			_WkWkSuumoJpDenyPathList.push('/chukoikkodate/*');
			_WkWkSuumoJpDenyPathList.push('/chukomansion/*');
			_WkWkSuumoJpDenyPathList.push('/tochi/*');
			_WkWkSuumoJpDenyPathList.push('/free/*');
			_WkWkSuumoJpDenyPathList.push('/kanto/*');
			_WkWkSuumoJpDenyPathList.push('/kansai/*');
			_WkWkSuumoJpDenyPathList.push('/reform/*');
			_WkWkSuumoJpDenyPathList.push('/remodel/*');
			_WkWkSuumoJpDenyPathList.push('/tokai/*');
			_WkWkSuumoJpDenyPathList.push('/fudosan/*');
			_WkWkSuumoJpDenyPathList.push('/kyushu/*');
			_WkWkSuumoJpDenyPathList.push('/baikyaku/*');
			_WkWkSuumoJpDenyPathList.push('/tohoku/*');
			_WkWkSuumoJpDenyPathList.push('/chugoku/*');
			_WkWkSuumoJpDenyPathList.push('/hokkaido/*');
			_WkWkSuumoJpDenyPathList.push('/koshinetsu/*');
			_WkWkSuumoJpDenyPathList.push('/sitemap/*');
			_WkWkSuumoJpDenyPathList.push('/fudousankaisha/*');
			_WkWkSuumoJpDenyPathList.push('/shikoku/*');
			_WkWkSuumoJpDenyPathList.push('/kasu/*');
			_WkWkSuumoJpDenyPathList.push('/mb/*');
			_WkWkSuumoJpDenyPathList.push('/kaisha/*');
			_WkWkSuumoJpDenyPathList.push('/baibai/*');
			_WkWkSuumoJpDenyPathList.push('/hokkaido/*');
			_WkWkSuumoJpDenyPathList.push('/aomori/*');
			_WkWkSuumoJpDenyPathList.push('/iwate/*');
			_WkWkSuumoJpDenyPathList.push('/miyagi/*');
			_WkWkSuumoJpDenyPathList.push('/akita/*');
			_WkWkSuumoJpDenyPathList.push('/yamagata/*');
			_WkWkSuumoJpDenyPathList.push('/fukushima/*');
			_WkWkSuumoJpDenyPathList.push('/ibaraki/*');
			_WkWkSuumoJpDenyPathList.push('/tochigi/*');
			_WkWkSuumoJpDenyPathList.push('/gumma/*');
			_WkWkSuumoJpDenyPathList.push('/saitama/*');
			_WkWkSuumoJpDenyPathList.push('/chiba/*');
			_WkWkSuumoJpDenyPathList.push('/tokyo/*');
			_WkWkSuumoJpDenyPathList.push('/kanagawa/*');
			_WkWkSuumoJpDenyPathList.push('/niigata/*');
			_WkWkSuumoJpDenyPathList.push('/toyama/*');
			_WkWkSuumoJpDenyPathList.push('/ishikawa/*');
			_WkWkSuumoJpDenyPathList.push('/fukui/*');
			_WkWkSuumoJpDenyPathList.push('/yamanashi/*');
			_WkWkSuumoJpDenyPathList.push('/nagano/*');
			_WkWkSuumoJpDenyPathList.push('/gifu/*');
			_WkWkSuumoJpDenyPathList.push('/shizuoka/*');
			_WkWkSuumoJpDenyPathList.push('/aichi/*');
			_WkWkSuumoJpDenyPathList.push('/mie/*');
			_WkWkSuumoJpDenyPathList.push('/shiga/*');
			_WkWkSuumoJpDenyPathList.push('/kyoto/*');
			_WkWkSuumoJpDenyPathList.push('/osaka/*');
			_WkWkSuumoJpDenyPathList.push('/hyogo/*');
			_WkWkSuumoJpDenyPathList.push('/nara/*');
			_WkWkSuumoJpDenyPathList.push('/wakayama/*');
			_WkWkSuumoJpDenyPathList.push('/tottori/*');
			_WkWkSuumoJpDenyPathList.push('/shimane/*');
			_WkWkSuumoJpDenyPathList.push('/okayama/*');
			_WkWkSuumoJpDenyPathList.push('/hiroshima/*');
			_WkWkSuumoJpDenyPathList.push('/yamaguchi/*');
			_WkWkSuumoJpDenyPathList.push('/tokushima/*');
			_WkWkSuumoJpDenyPathList.push('/kagawa/*');
			_WkWkSuumoJpDenyPathList.push('/ehime/*');
			_WkWkSuumoJpDenyPathList.push('/kochi/*');
			_WkWkSuumoJpDenyPathList.push('/fukuoka/*');
			_WkWkSuumoJpDenyPathList.push('/saga/*');
			_WkWkSuumoJpDenyPathList.push('/nagasaki/*');
			_WkWkSuumoJpDenyPathList.push('/kumamoto/*');
			_WkWkSuumoJpDenyPathList.push('/oita/*');
			_WkWkSuumoJpDenyPathList.push('/miyazaki/*');
			_WkWkSuumoJpDenyPathList.push('/kagoshima/*');
			_WkWkSuumoJpDenyPathList.push('/okinawa/*');
			_WkWkSuumoJpDenyPathList.push('/yougo/*');
			_WkWkSuumoJpDenyPathList.push('/sp/*');

		var _WkWkDenyList = [];
		if(tempDomain.match(/^suumo\.jp(\.suu\.raftel)?$/)
		|| tempDomain.match(/^www(adm|kr|pt)\.suumo\.jp\.suu\.raftel$/)
		|| tempDomain.match(/^wwwtst\.(r\.)?(k[0-9]?[0-9]\.)?suumo\.jp(\.suu\.raftel)?$/)
		|| tempDomain.match(/^wwwtst\.k2\.bessou\.suumo\.jp$/)
		|| tempDomain.match(/^(wwwtst\.)?ch-kskensaku\.suumo\.jp$/)
		|| tempDomain.match(/^ch-hrkensaku\.suumo\.jp$/)){
			_WkWkDenyList[tempDomain] = _WkWkSuumoJpDenyPathList;
		}else 
		if(tempDomain.match(/.*\.suu\.raftel$/)
		|| tempDomain.match(/^www(tst|adm)\..*/)
		|| tempDomain.match(/^(inaka|library|bessou|bridal|campus|eco|ekipita|manager|sakura|smp|gaku(navi|sei))\.suumo\.jp$/)
		|| tempDomain.match(/^(wwwtst\.(k[0-9]?[0-9]\.)?)?forrentstyle\.suumo\.jp(\.suu\.raftel)?$/)
		|| tempDomain.match(/^www(tst)?\.officemovement\.com(\.suu\.raftel)?$/)
		|| tempDomain.match(/^((www\.)?itoko\-dori|d\-planx|img01\.suumo)\.com$/)
		|| tempDomain.match(/^(nikkei\-suumo|search\-times)\.jp$/)
		|| tempDomain.match(/^suumo\.jp\.$/)
		|| tempDomain.match(/^(translate|webcache)\.googleusercontent\.com$/)){
			_WkWkDenyList[tempDomain] = _WkWkAllDenyPathList;
		}

		var checkWkWkDenyList = function() {
			var currentDomain = window.document.domain;
			var currentPath = window.location.pathname;
			var domainAndUrlInParams = getDomainAndUrlInParams();
			if (domainAndUrlInParams != null) {
				currentDomain = domainAndUrlInParams["domain"];
				currentPath = domainAndUrlInParams["path"];
			}
			var targetPathList = _WkWkDenyList[currentDomain];
			if (targetPathList != null && cheackDenyPath(currentPath, targetPathList)) {
				return true;
			}
			targetPathList = _WkWkDenyList["*"];
			if (targetPathList != null && cheackDenyPath(currentPath, targetPathList)) {
				return true;
			}
			return false;
		},
		getDomainAndUrlInParams = function() {
			var url = null;
			for (i = 0; i< _WkWkParams.length; i++) {
				var name = _WkWkParams[i][0];
				if (name == "URL") {
					url = _WkWkParams[i][1];
				}
			}
			if (url == null) {
				return null;
			}
			var idx1 = url.indexOf("//");
			var ret = [];
			if (idx1 < 0) {
				ret = null;
			} else {
				idx1 += 2;
				var idx2 = url.indexOf("/", idx1);
				if (idx2 < 0) {
					ret["domain"] = url.substring(idx1);
					ret["path"] = "/";
				} else {
					ret["domain"] = url.substring(idx1, idx2);
					ret["path"] = url.substring(idx2);
				}
			}
			return ret;
		},
		cheackDenyPath = function(currentPath, denyPathList) {
			for (var i = 0; i < denyPathList.length; i++) {
				var denyPath = denyPathList[i];
				if (denyPath.indexOf("/") != 0) {
					denyPath = "/" + denyPath;
				}
				var lIdx = denyPath.lastIndexOf("/*");
				var tIdx = denyPath.length - 2;
				if (lIdx >= 0 && lIdx == tIdx) {
					denyPath = denyPath.substring(0, lIdx + 1);
					if (currentPath.indexOf(denyPath) == 0) {
						return true;
					}
				} else {
					if (currentPath === denyPath) {
						return true;
					}
				}
			}
			return false;
		},
		defineOutputBeaconScript = function() {
			if (document.addEventListener) {
				document.addEventListener('DOMContentLoaded', outputBeaconScript, false);
			} else if (window.ActiveXObject && (document.readyState === 'complete' || document.readyState === 'loaded')) {
				document.attachEvent('onreadystatechange', outputBeaconScript);
			} else {
				document.onload = outputBeaconScript();
			}
		},
		outputBeaconScript = function() {
			var scriptTag = document.createElement('script');
			scriptTag.type = 'text/javascript';
			scriptTag.src = ('https:' == document.location.protocol ? "https://" : "http://") + "log.suumo.jp/js/logsuumo-10.js";
			if (document.addEventListener) {
				scriptTag.setAttribute('defer', 'defer');
			} else if (window.ActiveXObject) {
				scriptTag.setAttribute('defer', true);
			} else {
				scriptTag.setAttribute('defer', 'defer');
			}
			var beaconDiv = document.getElementById('WkWkBeaconDiv');
			if (beaconDiv == null) {
				var beaconDiv = document.createElement('div');
				beaconDiv.id = 'WkWkBeaconDiv';
				var firstScript = document.getElementsByTagName('script')[0];
				firstScript.parentNode.insertBefore(beaconDiv, firstScript);
			}
			if (beaconDiv.childNodes.length == 0) {
				beaconDiv.appendChild(scriptTag);
			} else {
				var first = beaconDiv.childNodes[0];
				beaconDiv.insertBefore(scriptTag, first);
			}
		};
		if (!checkWkWkDenyList()) {
			//defineOutputBeaconScript();
			outputBeaconScript();
		}
	}());
}
//-->