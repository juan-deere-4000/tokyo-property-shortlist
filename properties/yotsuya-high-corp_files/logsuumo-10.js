function WkWkTracker() {};
(function() {
	//////////////////////////////////////////////////////////////////////
	function WkWkConst() {};
	WkWkConst.DEFAULT_SESSION_COOKIE_AGE = 60 * 30 * 1000;             // 30min
	WkWkConst.MAX_SESSION_COOKIE_AGE = 60 * 60 * 12 * 1000;            // 12hour
	WkWkConst.DEFAULT_UUID_COOKIE_AGE = 60 * 60 * 24 * 365 * 1 * 1000; // 1Year
	WkWkConst.B_VERSION = "100D";
	WkWkConst.copyHost = "suumo.jp";
	WkWkConst.traceHost = "log.suumo.jp";
	WkWkConst.traceHost_dev = "log.suumo.jp";
	WkWkConst.traceContextPath = "LSServer";
	WkWkConst.traceContextPath_dev = "LSServer_dev";
	WkWkConst.copyUrl = WkWkConst.copyHost + "/edit/slab/beacon/cpcookie.php";
	WkWkConst.jsUrl = WkWkConst.traceHost + "/" + WkWkConst.traceContextPath + "/ls.gif";
	WkWkConst.jsUrl_dev = WkWkConst.traceHost_dev + "/" + WkWkConst.traceContextPath_dev + "/ls.gif";




	/**
	 * UUID.js: The RFC-compliant UUID generator for JavaScript.
	 *
	 * @fileOverview
	 * @author  LiosK
	 * @version 3.1
	 * @license The MIT License: Copyright (c) 2010 LiosK.
	 */

	// Core Component {{{

	/** @constructor */
	function UUID() {}
	/**
	 * The simplest function to get an UUID string.
	 * @returns {string} A version 4 UUID string.
	 */
	UUID.generate = function() {
	  var rand = UUID._getRandomInt, hex = UUID._hexAligner;
	  return  hex(rand(32), 8)          // time_low
	        + "-"
	        + hex(rand(16), 4)          // time_mid
	        + "-"
	        + hex(0x4000 | rand(12), 4) // time_hi_and_version
	        + "-"
	        + hex(0x8000 | rand(14), 4) // clock_seq_hi_and_reserved clock_seq_low
	        + "-"
	        + hex(rand(48), 12);        // node
	};

	/**
	 * Returns an unsigned x-bit random integer.
	 * @param {int} x A positive integer ranging from 0 to 53, inclusive.
	 * @returns {int} An unsigned x-bit random integer (0 <= f(x) < 2^x).
	 */
	UUID._getRandomInt = function(x) {
	  if (x <   0) return NaN;
	  if (x <= 30) return (0 | Math.random() * (1 <<      x));
	  if (x <= 53) return (0 | Math.random() * (1 <<     30))
	                    + (0 | Math.random() * (1 << x - 30)) * (1 << 30);
	  return NaN;
	};

	/**
	 * Returns a function that converts an integer to a zero-filled string.
	 * @param {int} radix
	 * @returns {function(num&#44; length)}
	 */
	UUID._getIntAligner = function(radix) {
	  return function(num, length) {
	    var hex = num.toString(radix), i = length - hex.length, z = "0";
	    for (; i > 0; i >>>= 1, z += z) { if (i & 1) { hex = z + hex; } }
	    return hex;
	  };
	};

	UUID._hexAligner = UUID._getIntAligner(16);

	// }}}

	// UUID Object Component {{{

	/**
	 * Names of each UUID field.
	 * @type string[]
	 * @constant
	 * @since 3.0
	 */
	UUID.FIELD_NAMES = ["timeLow", "timeMid", "timeHiAndVersion",
	                    "clockSeqHiAndReserved", "clockSeqLow", "node"];

	/**
	 * Sizes of each UUID field.
	 * @type int[]
	 * @constant
	 * @since 3.0
	 */
	UUID.FIELD_SIZES = [32, 16, 16, 8, 8, 48];

	/**
	 * Generates a version 4 {@link UUID}.
	 * @returns {UUID} A version 4 {@link UUID} object.
	 * @since 3.0
	 */
	UUID.genV4 = function() {
	  var rand = UUID._getRandomInt;
	  return new UUID()._init(rand(32), rand(16), // time_low time_mid
	                          0x4000 | rand(12),  // time_hi_and_version
	                          0x80   | rand(6),   // clock_seq_hi_and_reserved
	                          rand(8), rand(48)); // clock_seq_low node
	};

	/**
	 * Converts hexadecimal UUID string to an {@link UUID} object.
	 * @param {string} strId UUID hexadecimal string representation ("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
	 * @returns {UUID} {@link UUID} object or null.
	 * @since 3.0
	 */
	UUID.parse = function(strId) {
	  var r, p = /^(?:urn:uuid:)?([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{2})([0-9a-f]{2})-([0-9a-f]{12})$/i;
	  if (r = p.exec(strId)) {
	    return new UUID()._init(parseInt(r[1], 16), parseInt(r[2], 16),
	                            parseInt(r[3], 16), parseInt(r[4], 16),
	                            parseInt(r[5], 16), parseInt(r[6], 16));
	  } else {
	    return null;
	  }
	};

	/**
	 * Initializes {@link UUID} object.
	 * @param {uint32} [timeLow=0] time_low field (octet 0-3).
	 * @param {uint16} [timeMid=0] time_mid field (octet 4-5).
	 * @param {uint16} [timeHiAndVersion=0] time_hi_and_version field (octet 6-7).
	 * @param {uint8} [clockSeqHiAndReserved=0] clock_seq_hi_and_reserved field (octet 8).
	 * @param {uint8} [clockSeqLow=0] clock_seq_low field (octet 9).
	 * @param {uint48} [node=0] node field (octet 10-15).
	 * @returns {UUID} this.
	 */
	UUID.prototype._init = function() {
	  var names = UUID.FIELD_NAMES, sizes = UUID.FIELD_SIZES;
	  var bin = UUID._binAligner, hex = UUID._hexAligner;

	  /**
	   * List of UUID field values (as integer values).
	   * @type int[]
	   */
	  this.intFields = new Array(6);

	  /**
	   * List of UUID field values (as binary bit string values).
	   * @type string[]
	   */
	  this.bitFields = new Array(6);

	  /**
	   * List of UUID field values (as hexadecimal string values).
	   * @type string[]
	   */
	  this.hexFields = new Array(6);

	  for (var i = 0; i < 6; i++) {
	    var intValue = parseInt(arguments[i] || 0);
	    this.intFields[i] = this.intFields[names[i]] = intValue;
	    this.bitFields[i] = this.bitFields[names[i]] = bin(intValue, sizes[i]);
	    this.hexFields[i] = this.hexFields[names[i]] = hex(intValue, sizes[i] / 4);
	  }

	  /**
	   * UUID version number defined in RFC 4122.
	   * @type int
	   */
	  this.version = (this.intFields.timeHiAndVersion >> 12) & 0xF;

	  /**
	   * 128-bit binary bit string representation.
	   * @type string
	   */
	  this.bitString = this.bitFields.join("");

	  /**
	   * UUID hexadecimal string representation ("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
	   * @type string
	   */
	  this.hexString = this.hexFields[0] + "-" + this.hexFields[1] + "-" + this.hexFields[2]
	                 + "-" + this.hexFields[3] + this.hexFields[4] + "-" + this.hexFields[5];

	  /**
	   * UUID string representation as a URN ("urn:uuid:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx").
	   * @type string
	   */
	  this.urn = "urn:uuid:" + this.hexString;

	  return this;
	};

	UUID._binAligner = UUID._getIntAligner(2);

	/**
	 * Returns UUID string representation.
	 * @returns {string} {@link UUID#hexString}.
	 */
	UUID.prototype.toString = function() { return this.hexString; };

	/**
	 * Tests if two {@link UUID} objects are equal.
	 * @param {UUID} uuid
	 * @returns {bool} True if two {@link UUID} objects are equal.
	 */
	UUID.prototype.equals = function(uuid) {
	  if (!(uuid instanceof UUID)) { return false; }
	  for (var i = 0; i < 6; i++) {
	    if (this.intFields[i] !== uuid.intFields[i]) { return false; }
	  }
	  return true;
	};

	// }}}

	// UUID Version 1 Component {{{

	/**
	 * Generates a version 1 {@link UUID}.
	 * @returns {UUID} A version 1 {@link UUID} object.
	 * @since 3.0
	 */
	UUID.genV1 = function() {
	  var now = new Date().getTime(), st = UUID._state;
	  if (now != st.timestamp) {
	    if (now < st.timestamp) { st.sequence++; }
	    st.timestamp = now;
	    st.tick = UUID._getRandomInt(4);
	  } else if (Math.random() < UUID._tsRatio && st.tick < 9984) {
	    // advance the timestamp fraction at a probability
	    // to compensate for the low timestamp resolution
	    st.tick += 1 + UUID._getRandomInt(4);
	  } else {
	    st.sequence++;
	  }

	  // format time fields
	  var tf = UUID._getTimeFieldValues(st.timestamp);
	  var tl = tf.low + st.tick;
	  var thav = (tf.hi & 0xFFF) | 0x1000;  // set version '0001'

	  // format clock sequence
	  st.sequence &= 0x3FFF;
	  var cshar = (st.sequence >>> 8) | 0x80; // set variant '10'
	  var csl = st.sequence & 0xFF;

	  return new UUID()._init(tl, tf.mid, thav, cshar, csl, st.node);
	};

	/**
	 * Re-initializes version 1 UUID state.
	 * @since 3.0
	 */
	UUID.resetState = function() {
	  UUID._state = new UUID._state.constructor();
	};

	/**
	 * Probability to advance the timestamp fraction: the ratio of tick movements to sequence increments.
	 * @type float
	 */
	UUID._tsRatio = 1 / 4;

	/**
	 * Persistent state for UUID version 1.
	 * @type UUIDState
	 */
	UUID._state = new function UUIDState() {
	  var rand = UUID._getRandomInt;
	  this.timestamp = 0;
	  this.sequence = rand(14);
	  this.node = (rand(8) | 1) * 0x10000000000 + rand(40); // set multicast bit '1'
	  this.tick = rand(4);  // timestamp fraction smaller than a millisecond
	};

	/**
	 * @param {Date|int} time ECMAScript Date Object or milliseconds from 1970-01-01.
	 * @returns {object}
	 */
	UUID._getTimeFieldValues = function(time) {
	  var ts = time - Date.UTC(1582, 9, 15);
	  var hm = ((ts / 0x100000000) * 10000) & 0xFFFFFFF;
	  return  { low: ((ts & 0xFFFFFFF) * 10000) % 0x100000000,
	            mid: hm & 0xFFFF, hi: hm >>> 16, timestamp: ts };
	};

	// }}}

	// Backward Compatibility Component {{{

	/**
	 * Reinstalls {@link UUID.generate} method to emulate the interface of UUID.js version 2.x.
	 * @since 3.1
	 * @deprecated Version 2.x. compatible interface is not recommended.
	 */
	UUID.makeBackwardCompatible = function() {
	  var f = UUID.generate;
	  UUID.generate = function(o) {
	    return (o && o.version == 1) ? UUID.genV1().hexString : f.call(UUID);
	  };
	  UUID.makeBackwardCompatible = function() {};
	};

	// }}}

	// vim: et ts=2 sw=2 fdm=marker fmr&





	//////////////////////////////////////////////////////////////////////
	var WkWkParameter = function(name, value) {
		this.name = name;
		this.value = value;
	};


	//////////////////////////////////////////////////////////////////////
	var WkWkUtil = function() {};

	WkWkUtil.outputScriptTag = function(url) {
		var scr = document.createElement("script");
		scr.src = url;
		var targetNode = window.document.getElementsByTagName("script")[0];
		WkWkUtil.appendChild(scr, targetNode);
	};

	WkWkUtil.outputScriptTagWithOnloadEvent = function(url, nextFunc, nextFuncArgs) {
		var ifr = document.createElement("iframe");
		ifr.style.display = "none";
		var targetNode = window.document.getElementsByTagName("script")[0];
		WkWkUtil.appendChild(ifr, targetNode);
		ifr.onload = function() {
			WkWkUtil.loadScript(nextFunc, nextFuncArgs);
		};
		ifr.onreadystatechange = function() {
			if (this.readyState == "loaded" || this.readyState == "complete") {
				WkWkUtil.loadScript(nextFunc, nextFuncArgs);
			}
		};

		ifr.contentWindow.document.write('<body><script type="text/javascript" src="' + url + '"></script></body>');
		ifr.contentWindow.document.close();
	};

	WkWkUtil.outputImgTag = function(url) {
		var scr = document.createElement("img");
		scr.src = url;
		scr.height = 0;
		scr.width = 0;
		scr.style.display = "none";
		var targetNode = window.document.getElementsByTagName("script")[0];
		WkWkUtil.appendChild(scr, targetNode);
	};

	WkWkUtil.outputImgTagWithOnloadEvent = function(url, nextFunc, nextFuncArgs) {

		var ifr = document.createElement("iframe");
		ifr.style.display = "none";
		var targetNode = window.document.getElementsByTagName("script")[0];
		WkWkUtil.appendChild(ifr, targetNode);
		ifr.onload = function() {
			WkWkUtil.loadScript(nextFunc, nextFuncArgs);
		};
		ifr.onreadystatechange = function() {
			if (this.readyState == "loaded" || this.readyState == "complete") {
				WkWkUtil.loadScript(nextFunc, nextFuncArgs);
			}
		};

		ifr.contentWindow.document.write('<body><img src="' + url + '" height="0" width="0" alt="" style="display:none"/></body>');
		ifr.contentWindow.document.close();

	};

	WkWkUtil.appendChild = function(child, targetNode) {
		var beaconDiv = document.getElementById('WkWkBeaconDiv');
		if (beaconDiv == null) {
			targetNode.parentNode.insertBefore(child, targetNode);
		} else {
			var firstChild = beaconDiv.firstChild;
			if (firstChild == null) {
				beaconDiv.appendChild(child);
			} else {
				beaconDiv.insertBefore(child, firstChild);
			}
		}
	};


	WkWkUtil.loadScript = function(nextFunc, nextFuncArgs) {
		nextFunc(nextFuncArgs);
	};

	WkWkUtil.createUrlParameter = function(name, value) {
		return encodeURIComponent(name) + "=" + encodeURIComponent(value);
	};

	WkWkUtil.getBeaconQueryString = function(wkat, templateId, pageId, parameters, url, referrer, title) {
		if (templateId == null) {
			templateId = "";
		}
		if (pageId == null) {
			pageId = "";
		}
		var userIDCookie = WkWkCookieUtil.getUserIDCookie();
		if (userIDCookie == null) {
			userIDCookie = new UserIDCookie();
			userIDCookie.userID = "";
			userIDCookie.vc = 0;
		}
		var sessionIDCookie = WkWkCookieUtil.getSessionIDCookie();
		if (sessionIDCookie == null) {
			sessionIDCookie = new SessionIDCookie();
			sessionIDCookie.expire = 0;
			sessionIDCookie.sessionID = "";
			sessionIDCookie.vc = 0;
		}

		var qs = WkWkUtil.createUrlParameter("wkat", wkat);
		qs += "&" + WkWkUtil.createUrlParameter("templateId", templateId);
		qs += "&" + WkWkUtil.createUrlParameter("pageId", pageId);
		if (url != null && url != "") {
			qs += "&" + WkWkUtil.createUrlParameter("URL", url);
		} else {
			qs += "&" + WkWkUtil.createUrlParameter("URL", document.URL);
		}
		if (title != null && title != "") {
			qs += "&" + WkWkUtil.createUrlParameter("title", title);
		} else {
			qs += "&" + WkWkUtil.createUrlParameter("title", document.title);
		}
		if (referrer != null && referrer != "") {
			qs += "&" + WkWkUtil.createUrlParameter("referrer", referrer);
		} else {
			qs += "&" + WkWkUtil.createUrlParameter("referrer", document.referrer);
		}
		qs += "&" + WkWkUtil.createUrlParameter("parameters", WkWkUtil.getParametersValue(parameters));
		qs += "&" + WkWkUtil.createUrlParameter("__wk_a", userIDCookie.userID);
		qs += "&" + WkWkUtil.createUrlParameter("__wk_b", sessionIDCookie.sessionID);
		qs += "&" + WkWkUtil.createUrlParameter("vc", sessionIDCookie.vc);
		qs += "&" + WkWkUtil.createUrlParameter("b_ver", WkWkConst.B_VERSION);
		qs += "&" + WkWkUtil.createUrlParameter("rand", WkWkUtil.getRandomParameter());
		return qs;
	};

	WkWkUtil.getParametersValue = function(parameters) {
		var strParams = "";
		for (i = 0; i < parameters.length; i++) {
			if (i != 0) {
				strParams += "&";
			}
			var parameter = parameters[i];
			strParams += WkWkUtil.createUrlParameter(parameter.name, parameter.value);
		}
		return strParams;
	};

	WkWkUtil.transferPage = function(nextPage) {
		window.location = nextPage;
	};

	WkWkUtil.getNextPage = function() {
		var e = (window.event) ? window.event : arguments.callee.caller.arguments[0] ;
		var nextPage = e.target || e.srcElement;
		return nextPage;
	};
	WkWkUtil.isLocalFile = function() {
		var protocol = window.location.protocol.toUpperCase();
		if (protocol === "HTTP:" || protocol === "HTTPS:") {
			return false;
		} else {
			return true;
		}
	};

	WkWkUtil.getRandomParameter = function() {
		var rand = Math.floor(Math.random() * 100);
		var date = new Date();
		return date.getTime() + "" + rand;
	};

	WkWkUtil.isDeveloperDomain = function(developerDomains) {
		var domain = window.document.domain;
		for (var i = 0; i < developerDomains.length; i++) {
			if (domain === developerDomains[i]) {
				return true;
			}
		}
		return false;
	};
	//////////////////////////////////////////////////////////////////////
	var UserIDCookie = function() {
		this.userID = null;
		this.vc = 0;
		this.getCookieValue = function() {
			return this.userID + "|" + this.vc;
		};
	};
	//////////////////////////////////////////////////////////////////////
	var SessionIDCookie = function() {
		this.expire = null;
		this.sessionID = null;
		this.vc = null;
		this.getCookieValue = function() {
			return this.expire + "|" + this.sessionID + "|" + this.vc;
		};
	};
	//////////////////////////////////////////////////////////////////////
	var WkWkCookieUtil = function() {};

	WkWkCookieUtil.getCookieValue = function(name) {
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var nameAndValue = cookie.split("=");
			var cookieName = nameAndValue[0].replace(/(^\s+)|(\s+$)/g, "");
			if (name == cookieName) {
				var cookieValue = nameAndValue[1].replace(/(^\s+)|(\s+$)/g, "");
				return cookieValue;
			}
		}
		return null;
	};

	WkWkCookieUtil.setCookie = function(name, value, allowCookieDomain, allowCookiePath, exp) {
		var cookieValue = name + "=" + value;
		if (allowCookieDomain != null) {
			if (WkWkCookieUtil.checkAllowCookieDomain(allowCookieDomain)) {
				cookieValue += "; Domain=" + allowCookieDomain;
			}
		}
		if (allowCookiePath != null) {
			cookieValue += "; Path=" + allowCookiePath;
		} else {
			cookieValue += "; Path=/";
		}
		if (exp != null) {
			cookieValue += "; expires=" + exp.toUTCString();
		}
		document.cookie = cookieValue;
	};
	WkWkCookieUtil.checkAllowCookieDomain = function(allowCookieDomain) {
		var uACD = allowCookieDomain.toUpperCase();
		var domain = document.domain.toUpperCase();
		if (allowCookieDomain === "") {
			return false;
		}
		if (uACD === domain) {
			return true;
		}
		if (domain.length >= uACD.length) {
			return false;
		}
		var end = uACD.substring(uACD.length - domain.length);
		if (end === domain) {
			var start = uACD.substring(uACD.length - domain.length - 1, uACD.length - domain.length);
			if (start === ".") {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	WkWkCookieUtil.getUserIDCookie = function() {
		var wkAVal = WkWkCookieUtil.getCookieValue("__wk_a");
		var userID = null;
		var vc = 0;
		if (wkAVal == null) {
			return null;
		} else if (!wkAVal.match("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\|[0-9]+$")) {
			return null;
		} else {
			var idx = wkAVal.indexOf("|");
			userID = wkAVal.substring(0, idx);
			vc = Number(wkAVal.substring(idx + 1));
			if (vc < 0 || 9223372036854775807 < vc) {
				return null;
			}
			var userIDCookie = new UserIDCookie();
			userIDCookie.userID = userID;
			userIDCookie.vc = vc;
			return userIDCookie;
		}
	};
	WkWkCookieUtil.createAndUpdateUserIDCookie = function(allowCookieDomain, allowCookiePath, timeout) {
		var isCreateNew = false;
		var userIDCookie = WkWkCookieUtil.getUserIDCookie();
		if (userIDCookie == null) {
			userIDCookie = new UserIDCookie();
			userIDCookie.userID = UUID.genV4();
			userIDCookie.vc = 0;
			isCreateNew = true;
		}
		var exp = new Date();
		exp.setTime(exp.getTime() + timeout);
		WkWkCookieUtil.setCookie("__wk_a", userIDCookie.getCookieValue(), allowCookieDomain, allowCookiePath, exp);
		return isCreateNew;
	};
	WkWkCookieUtil.incrementAndUpdateVCInUserIDCookie = function(allowCookieDomain, allowCookiePath, timeout) {
		var userIDCookie = WkWkCookieUtil.getUserIDCookie();
		if (userIDCookie == null) {
			userIDCookie = new UserIDCookie();
			userIDCookie.userID = UUID.genV4();
			userIDCookie.vc = 0;
		} else if (9223372036854775807 == userIDCookie.vc) {
			vc = 0;
		}
		userIDCookie.vc = userIDCookie.vc + 1;
		var exp = new Date();
		exp.setTime(exp.getTime() + timeout);
		WkWkCookieUtil.setCookie("__wk_a", userIDCookie.getCookieValue(), allowCookieDomain, allowCookiePath, exp);
		return userIDCookie.vc;
	};

	WkWkCookieUtil.createAndUpdateSessionIDCookie = function(isCreateNewUserCookie, allowCookieDomain, allowCookiePath, timeout, userCookieMaxAge) {
		var exp = new Date();
		exp.setTime(exp.getTime() + timeout);

		var sessionIDCookie = null;
		if (isCreateNewUserCookie == false) {
			sessionIDCookie = WkWkCookieUtil.getSessionIDCookie();
		}
		var isFirstSession = false;
		if (sessionIDCookie == null) {
			sessionIDCookie = new SessionIDCookie();
			sessionIDCookie.expire = exp.getTime();
			sessionIDCookie.sessionID = UUID.genV4();
			sessionIDCookie.vc = WkWkCookieUtil.incrementAndUpdateVCInUserIDCookie(allowCookieDomain, allowCookiePath, userCookieMaxAge);
			isFirstSession = true;
		}
		WkWkCookieUtil.setCookie("__wk_b", sessionIDCookie.getCookieValue(), allowCookieDomain, allowCookiePath, null);
		return isFirstSession;
	};

	WkWkCookieUtil.getSessionIDCookie = function() {
		var wkBVal = WkWkCookieUtil.getCookieValue("__wk_b");
		if (wkBVal == null) {
			return null;
		} else if (!wkBVal.match("^[0-9]+\\|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\|[0-9]+$")) {
			return null;
		} else {
			var idx1 = wkBVal.indexOf("|");
			var idx2 = wkBVal.indexOf("|", idx1 + 1);
			var date = new Date();
			var expDate = new Date();
			expDate.setTime(wkBVal.substring(0, idx1));
			if (isNaN(expDate) || expDate.getTime() < date.getTime()) {
				return null;
			}
			var sessionID = wkBVal.substring(idx1 + 1, idx2);
			var vc = Number(wkBVal.substring(idx2 + 1));
			if (vc < 0 || 9223372036854775807 < vc) {
				return null;
			}

			var sessionIDCookie = new SessionIDCookie();
			sessionIDCookie.expire = expDate.getTime();
			sessionIDCookie.sessionID = sessionID;
			sessionIDCookie.vc = vc;
			return sessionIDCookie;
		}
	};
	//////////////////////////////////////////////////////////////////////
	var WkWkEventUtil = function() {};

	WkWkEventUtil.preventDefault = function(event) {
		if(event.preventDefault){
			event.preventDefault();
		} else if(window.event){
			window.event.returnValue = false;
		}
	};

	WkWkEventUtil.changeLocation = function(args) {
		var target = args[0];
		var href = args[1];
		if (target == null || target == "") {
			window.location = href;
		} else {
			//window.open(href, target);
			window.open(href, target);
		}
	};

	WkWkEventUtil.sendSubmit = function(args) {
		var form = args[0];
		form.submit();
	};

	WkWkEventUtil.getParentForm = function(node) {
		if (node == null) {
			return null;
		}
		if (node.tagName == "BODY") {
			return null;
		}
		if (node.tagName == "FORM") {
			return node;
		}
		return WkWkEventUtil.getParentForm(node.parentNode);
	};

	//////////////////////////////////////////////////////////////////////
	var PageCondition = function() {
		this.templateId = null;
		this.pageId = null;
		this.allowCookieDomain = null;
		this.allowCookiePath = null;
		this.userCookieMaxAge = WkWkConst.DEFAULT_UUID_COOKIE_AGE;
		this.sessionCookieMaxAge = WkWkConst.DEFAULT_SESSION_COOKIE_AGE;
		this.parameters = [];
		this.isNoTracePV = false;
		this.redirectUrl = null;
		this.url = null;
		this.referrer = null;
		this.title = null;
		this.developerDomains = [];
		if (typeof(_WkWkParams) === 'undefined') {
			return;
		}
		for (i = 0; i< _WkWkParams.length; i++) {
			var name = _WkWkParams[i][0];

			if (name == "TEMPLATE_ID") {
				this.templateId = _WkWkParams[i][1];
			} else if (name == "PAGE_ID") {
				this.pageId = _WkWkParams[i][1];
			} else if (name == "ALLOW_COOKIE_DOMAIN") {
				this.allowCookieDomain = _WkWkParams[i][1];
			} else if (name == "ALLOW_COOKIE_PATH") {
				this.allowCookiePath = _WkWkParams[i][1];
			} else if (name == "SESSION_COOKIE_MAX_AGE") {
				if (typeof(_WkWkParams[i][1]) != "number") {
					this.sessionCookieMaxAge = WkWkConst.DEFAULT_SESSION_COOKIE_AGE;
				} else if (_WkWkParams[i][1] < 0) {
					this.sessionCookieMaxAge = WkWkConst.DEFAULT_SESSION_COOKIE_AGE;
				} else if(WkWkConst.MAX_SESSION_COOKIE_AGE < _WkWkParams[i][1]) {
					this.sessionCookieMaxAge = WkWkConst.MAX_SESSION_COOKIE_AGE;
				}
			} else if (name == "USER_COOKIE_MAX_AGE") {
				if (typeof(_WkWkParams[i][1]) != "number") {
					this.userCookieMaxAge = WkWkConst.DEFAULT_UUID_COOKIE_AGE;
				} else if (_WkWkParams[i][1] < 0) {
					this.userCookieMaxAge = WkWkConst.DEFAULT_UUID_COOKIE_AGE;
				}
			} else if (name == "PARAMETER") {
				var paramName = _WkWkParams[i][1];
				var paramValue = _WkWkParams[i][2];
				this.parameters.push(new WkWkParameter(paramName, paramValue));
			} else if (name == "NO_TPV") {
				this.isNoTracePV = true;
			} else if (name == "REDIRECT_URL") {
				this.redirectUrl = _WkWkParams[i][1];
			} else if (name == "URL") {
				this.url = _WkWkParams[i][1];
			} else if (name == "REFERRER") {
				this.referrer = _WkWkParams[i][1];
			} else if (name == "TITLE") {
				this.title = _WkWkParams[i][1];
			} else if (name == "DEVELOPER_DOMAIN") {
				this.developerDomains.push(_WkWkParams[i][1]);
			}
		}
	};





//////////////////////////////////////////////////////////////////////
	WkWkTracker.tracePageView = function() {
		if (WkWkUtil.isLocalFile()) {
			return;
		}
		if (typeof(_WkWkParams) === 'undefined') {
			return;
		}
		var condition = new PageCondition();
		if (condition.isNoTracePV) {
			return;
		}
		var nextFunc = null;
		var nextFuncArgs = null;
		if (condition.redirectUrl != null && condition.redirectUrl !== "") {
			nextFunc = WkWkEventUtil.changeLocation;
			nextFuncArgs = [null, condition.redirectUrl];
		}
		WkWkTracker.track("TPV", condition, nextFunc, nextFuncArgs);
	};

	WkWkTracker.trackEvent = function(event, optionParameters) {
		if (WkWkUtil.isLocalFile()) {
			return;
		}
		var condition = new PageCondition();
		if (optionParameters != null) {
			for (i = 0; i< optionParameters.length; i++) {
				var paramName = optionParameters[i][0];
				var paramValue = optionParameters[i][1];
				condition.parameters.push(new WkWkParameter(paramName, paramValue));
			}
		}
		var cEvent = (window.event) ? window.event : arguments.callee.caller.arguments[0];
		var eventType = cEvent.type;
		var targetNode = cEvent.target || cEvent.srcElement;
		var nextFunc = null;
		var nextFuncArgs = null;

		if (eventType == "click") {
			var tagName = targetNode.nodeName.toUpperCase();
			if (tagName == "A") {
				// href
				var href = targetNode.href;
				var target = targetNode.target;
				if (target == null || target == "") {
					nextFunc = WkWkEventUtil.changeLocation;
					nextFuncArgs = [target, href];
					WkWkEventUtil.preventDefault(cEvent);
				}
			} else if (tagName == "INPUT") {
				var type = targetNode.type.toUpperCase();
				if (type == "SUBMIT") {
					var formNode = WkWkEventUtil.getParentForm(targetNode);
					if (formNode != null) {
						nextFunc = WkWkEventUtil.sendSubmit;
						nextFuncArgs = [formNode];
						WkWkEventUtil.preventDefault(cEvent);
					}
				}
			}
		}
		WkWkTracker.track("TE", condition, nextFunc, nextFuncArgs);
	};

	WkWkTracker.track = function(wkat, condition, nextFunc, nextFuncArgs) {
		var isCreateNewUserCookie = WkWkCookieUtil.createAndUpdateUserIDCookie(condition.allowCookieDomain, condition.allowCookiePath, condition.userCookieMaxAge);
		var isFirstSession = WkWkCookieUtil.createAndUpdateSessionIDCookie(isCreateNewUserCookie, condition.allowCookieDomain, condition.allowCookiePath, condition.sessionCookieMaxAge, condition.userCookieMaxAge);
		var qs = WkWkUtil.getBeaconQueryString(wkat, condition.templateId, condition.pageId, condition.parameters, condition.url, condition.referrer, condition.title);

		var isDeveloperDomain = WkWkUtil.isDeveloperDomain(condition.developerDomains);
		var lsUrl = null;
		if (isDeveloperDomain) {
			lsUrl = ('https:' == document.location.protocol ? 'https://' : 'http://') + WkWkConst.jsUrl_dev + "?" + qs;
		} else {
			lsUrl = ('https:' == document.location.protocol ? 'https://' : 'http://') + WkWkConst.jsUrl + "?" + qs;
		}
		var lsArgs = [lsUrl, nextFunc, nextFuncArgs];
		if (isFirstSession === true && WkWkConst.copyUrl != "") {
			WkWkTracker.sendToSU(lsArgs);
		} else {
			WkWkTracker.sendToLS(lsArgs);
		}

	};

	WkWkTracker.sendToSU = function(lsArgs) {
		var suUrl = ('https:' == document.location.protocol ? 'https://' : 'http://') + WkWkConst.copyUrl;
		WkWkUtil.outputScriptTagWithOnloadEvent(suUrl, WkWkTracker.sendToLS, lsArgs);
	};

	WkWkTracker.sendToLS = function(lsArgs) {
		var lsUrl = lsArgs[0];
		var nextFunc = lsArgs[1];
		var nextFuncArgs = lsArgs[2];
		if (nextFunc == null) {
	 		WkWkUtil.outputImgTag(lsUrl);
		} else {
 			WkWkUtil.outputImgTagWithOnloadEvent(lsUrl, nextFunc, nextFuncArgs);
 		}
	};

	WkWkTracker.tracePageView();

})();

