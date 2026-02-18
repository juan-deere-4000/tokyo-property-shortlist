$.functionScope = function(target, func){ return function() { return func.apply(target, arguments);}};
/**
 * ZipSearchClient.js
 *
 * 郵便番号検索＆市区郡町村プルダウン生成を行うJavascriptクラスです。
 *
 */
var ZipSearchClient = function(){

     this.variableName = null;

     this.tmpelmZipCd1 = null;
     this.tmpelmZipCd2 =  null;
     this.tmpelmZipCd =  null;
     this.tmpelmTmpZipCd =  null;
     this.tmpelmTdfCd =  null;
     this.tmpelmSgkCd =  null;
     this.tmpelmJShsi =  null;
     this.elmAddressList = null;


     this.aryZip1 = new Array();
     this.aryZip2 = new Array();
     this.aryTodofuken = new Array();
     this.aryShigunku = new Array();
     this.aryJusho = new Array();


     this.zipAppcontext =  null;
     this.zipShikugunNmList = new Array();    //市区郡名リスト
     this.zipShikugunCdList = new Array();    //市区郡コードリスト
     this.tmpSelectZipShikugunCd =  null;
     this.lockShikugun =  null;
     this.lockZip =  null;
     // Mantis0025504:MS7 LKI yanghy 2010/12/07 start
     this.lockZipView =  null;
     // Mantis0025504:MS7 LKI yanghy 2010/12/07 end
     this.tmpelmSgkCdSel = null;

     this.isBrowserHasW3C = false
}
ZipSearchClient.prototype={
    /**
     *
     */
    createShikugunList : function(appcontext, tf, sc) {

        if (this.lockShikugun == null) {
            this.zipAppcontext = appcontext;
            this.createSikugun(sc, tf);
        }
    },

    /**
     *
     */
    setup : function(elmZipCd1, elmZipCd2, elmTdfCd, elmSgkCd, elmJShsi, elmAdrl, elmSgkCdSel, variableName) {

        this.variableName = variableName;

        this.tmpelmZipCd1 = elmZipCd1;
        this.tmpelmZipCd2 = elmZipCd2;
        this.tmpelmTdfCd = elmTdfCd;
        this.tmpelmSgkCd = elmSgkCd;
        this.tmpelmJShsi = elmJShsi;

        this.elmAddressList = elmAdrl;
        this.elmAddressList.hide();

        this.tmpelmSgkCdSel = elmSgkCdSel;

        if ($.browser.msie)
        	this.isBrowserHasW3C = false;
        else
        	this.isBrowserHasW3C = true;

    },

    /**
     * スマホ資料請求郵便番号検索ファクション(郵便番号フォーム7桁用）
     */
    smpShiryoSetup : function(elmZipCd, elmTdfCd, elmSgkCd, elmJShsi, elmAdrl, elmSgkCdSel, variableName) {

        this.variableName = variableName;

        this.tmpelmZipCd = elmZipCd;

        this.tmpelmTdfCd = elmTdfCd;
        this.tmpelmSgkCd = elmSgkCd;
        this.tmpelmJShsi = elmJShsi;

        this.elmAddressList = elmAdrl;
        this.elmAddressList.hide();

        this.tmpelmSgkCdSel = elmSgkCdSel;

        if ($.browser.msie)
        	this.isBrowserHasW3C = false;
        else
        	this.isBrowserHasW3C = true;

    },

    /**
     *
     */
    searchZip : function(appcontext) {
        if (this.lockZip == 'locked'){
            return false;
        }

        // 郵便番号検索機能の実行中ロックON
        this.lockZip ='locked';

        // 郵便番号コード取得
        var zip1 = this.tmpelmZipCd1.attr("value");
        var zip2 = this.tmpelmZipCd2.attr("value");

        this.clearSuggest();

        if (appcontext == "/") {
            appcontext = "";
        }

        this.zipAppcontext = appcontext;
        $.ajax({
            type: "GET",
            url: appcontext + "/common/function/JJ901FL017/",
            data: "zipcd1=" + zip1 + "&zipcd2=" + zip2,
            success: $.functionScope(this, this.callbackZipSearch),
            error: function() {
                alert("該当する住所がありません");
            }
        });
        // 郵便番号検索機能の実行中ロックOFF
        this.lockZip ='';

        return false;
    },

    // Mantis0025504:MS7 LKI yanghy 2010/12/07 start
    /**
     * auto住所を検索する
     */
    autoSearchZip : function(appcontext) {
        if (this.lockZip == 'locked'){
            return false;
        }

        // 郵便番号検索機能の実行中ロックON
        this.lockZip ='locked';

        // 郵便番号コード取得
        var zip1 = this.tmpelmZipCd1.attr("value");
        var zip2 = this.tmpelmZipCd2.attr("value");

        this.clearSuggest();

        if (appcontext == "/") {
            appcontext = "";
        }

        this.zipAppcontext = appcontext;
        $.ajax({
            type: "GET",
            url: appcontext + "/common/function/JJ901FL017/",
            data: "zipcd1=" + zip1 + "&zipcd2=" + zip2,
            success: $.functionScope(this, this.autoCallbackZipSearch),
            error: function() {
                alert("該当する住所がありません");
            }
        });
        // 郵便番号検索機能の実行中ロックOFF
        this.lockZip ='';

        return false;
    },
    autoCallbackZipSearch : function(resp) {
        if (this.lockZipView == 'locked'){
            return false;
        }

        this.lockZipView == 'locked';
        this.elmAddressList.html("");

        var i = 1;
        var resultSet = $('RESULTSET', resp);
        var jusho = $('JUSHO[NO = "' + i + '"]', resultSet);

        if ($('FIELD[NAME = ZIP_CD1]', jusho).text() != "") {
            while (true) {
                jusho = $('JUSHO[NO = "' + i + '"]', resultSet);
                var zip1 = $('FIELD[NAME = ZIP_CD1]', jusho).text();
                if (zip1 == "") break;
                var zip2 = $('FIELD[NAME = ZIP_CD2]', jusho).text();
                var todofukenCd = $('FIELD[NAME = TODOFUKEN_CD]', jusho).text();
                var todofuken = $('FIELD[NAME = TODOFUKEN]', jusho).text();
                var shigunkuCd = $('FIELD[NAME = SHIGUNKU_CD]', jusho).text();
                var shigunku = $('FIELD[NAME = SHIGUNKU]', jusho).text();
                var ooaza = $('FIELD[NAME = OOAZA]', jusho).text();
                var chome = $('FIELD[NAME = CHOME]', jusho).text();

                var item = zip1 + "-"
                        + zip2 + "&nbsp"
                        + todofuken
                        + shigunku
                        + ooaza
                        + chome;

                if (item != "") {
                    var a = '<a href="javascript:void(0);" onkeyup="if (event.keyCode == 13) { '
                        + this.variableName + '.doSelection(' + i + '); '
                        + this.variableName + '.clearSuggest();}" onmouseup="'
                        + this.variableName + '.doSelection(' + i + ');'
                        + this.variableName + '.clearSuggest();' + '">' + item + '</a>';
                    this.elmAddressList.append(a);
                }
                this.aryZip1[i-1] = zip1;
                this.aryZip2[i-1] = zip2;
                this.aryTodofuken[i-1] = todofukenCd;
                this.aryShigunku[i-1] = shigunkuCd;
                this.aryJusho[i-1] = ooaza + chome;
                i++;
            }
            if (i == 2) {
                this.lockShikugun = 'Locked';
                if (this.aryZip1[0] != null) {
                    this.tmpelmZipCd1.attr("value", this.aryZip1[0]);
                }
                if (this.aryZip2[0] != null) {
                    this.tmpelmZipCd2.attr("value", this.aryZip2[0]);
                }
                if (this.aryTodofuken[0] != null) {
                    this.tmpelmTdfCd.attr("value", this.aryTodofuken[0]);
                }
                if (this.aryShigunku[0] != null) {
                    this.createSikugun(this.aryShigunku[0], this.aryTodofuken[0]);
                }
                if (this.aryJusho[0] != null) {
                    this.tmpelmJShsi.attr("value", this.aryJusho[0]);

                    if (this.isBrowserHasW3C == true) {
                    	if (typeof txChangeFF == "function")
							txChangeFF(this.tmpelmJShsi.attr("id"));
                    }
                }
                this.lockShikugun = null;
            } else {
                this.elmAddressList.show();
            }
            // 郵便番号テキストからfocusが外れた場合、suggestlistを消す
            document.onmouseup = $.functionScope(this, this.clearSuggest);

        } else {
            this.tmpelmTdfCd.attr("value", "");
            this.tmpelmSgkCd.attr("value", "");
            this.tmpelmJShsi.attr("value", "");

			if (this.isBrowserHasW3C == true) {
				if (typeof txChangeFF == "function")
					txChangeFF(this.tmpelmJShsi.attr("id"));
			}
        }
        this.lockZipView ='';
    },
    //Mantis0025504:MS7 LKI yanghy 2010/12/07 end

   /**
    *  スマホ最適化用
    */
   smpSearchZip : function(appcontext) {
       if (this.lockZip == 'locked'){
           return false;
       }

       // 郵便番号検索機能の実行中ロックON
       this.lockZip ='locked';

       // 郵便番号コード取得
       var zip1 = this.tmpelmZipCd1.attr("value");
       var zip2 = this.tmpelmZipCd2.attr("value");

       if (appcontext == "/") {
           appcontext = "";
       }

       this.zipAppcontext = appcontext;
       $.ajax({
           type: "GET",
           url: appcontext + "/common/function/JJ901FL018/",
           data: "zipcd1=" + zip1 + "&zipcd2=" + zip2,
           success: $.functionScope(this, this.smpCallbackZipSearch),
           error: function() {
               alert("該当する住所がありません");
           }
       });
       // 郵便番号検索機能の実行中ロックOFF
       this.lockZip ='';

       return false;
   },

   /**
    *  スマホ資料請求郵便番号検索ファクション（郵便番号フォーム7桁用）
    */
   smpShiryoSearchZip : function(appcontext) {
       if (this.lockZip == 'locked'){
           return false;
       }

       // 郵便番号検索機能の実行中ロックON
       this.lockZip ='locked';

       // 郵便番号コード取得
       var zip = this.tmpelmZipCd.attr("value");

       if (appcontext == "/") {
           appcontext = "";
       }

       this.zipAppcontext = appcontext;
       $.ajax({
           type: "GET",
           url: appcontext + "/common/function/JJ901FL018/",
           data: "zipcd=" + zip + "&zipkbn=1",
           success: $.functionScope(this, this.smpShiryoCallbackZipSearch),
           error: function() {
               alert("該当する住所がありません");
           }
       });
       // 郵便番号検索機能の実行中ロックOFF
       this.lockZip ='';

       return false;
   },

    /**
     * 非同期郵便番号住所検索のコールバックイベント
     */
    callbackZipSearch : function(resp) {

        var i = 1;
        var resultSet = $('RESULTSET', resp);
        var jusho = $('JUSHO[NO = "' + i + '"]', resultSet);

        if ($('FIELD[NAME = ZIP_CD1]', jusho).text() != "") {
            while (true) {
                jusho = $('JUSHO[NO = "' + i + '"]', resultSet);
                var zip1 = $('FIELD[NAME = ZIP_CD1]', jusho).text();
                if (zip1 == "") break;
                var zip2 = $('FIELD[NAME = ZIP_CD2]', jusho).text();
                var todofukenCd = $('FIELD[NAME = TODOFUKEN_CD]', jusho).text();
                var todofuken = $('FIELD[NAME = TODOFUKEN]', jusho).text();
                var shigunkuCd = $('FIELD[NAME = SHIGUNKU_CD]', jusho).text();
                var shigunku = $('FIELD[NAME = SHIGUNKU]', jusho).text();
                var ooaza = $('FIELD[NAME = OOAZA]', jusho).text();
                var chome = $('FIELD[NAME = CHOME]', jusho).text();

                var item = zip1 + "-"
                        + zip2 + "&nbsp"
                        + todofuken
                        + shigunku
                        + ooaza
                        + chome;

                if (item != "") {
                    var a = '<a href="javascript:void(0);" onkeyup="if (event.keyCode == 13) { '
                        + this.variableName + '.doSelection(' + i + '); '
                        + this.variableName + '.clearSuggest();}" onmouseup="'
                        + this.variableName + '.doSelection(' + i + ');'
                        + this.variableName + '.clearSuggest();' + '">' + item + '</a>';
                    this.elmAddressList.append(a);
                }
                this.aryZip1[i-1] = zip1;
                this.aryZip2[i-1] = zip2;
                this.aryTodofuken[i-1] = todofukenCd;
                this.aryShigunku[i-1] = shigunkuCd;
                this.aryJusho[i-1] = ooaza + chome;
                i++;
            }
            // 郵便番号テキストからfocusが外れた場合、suggestlistを消す
            document.onmouseup = $.functionScope(this, this.clearSuggest);
            this.elmAddressList.show();

        } else {
            this.tmpelmTdfCd.attr("value", "");
            this.tmpelmSgkCd.attr("value", "");
            this.tmpelmJShsi.attr("value", "");

			if (this.isBrowserHasW3C == true) {
				if (typeof txChangeFF == "function")
					txChangeFF(this.tmpelmJShsi.attr("id"));
			}
        }
    },

    /**
     * (スマホ最適化用)非同期郵便番号住所検索のコールバックイベント
     */
    smpCallbackZipSearch : function(resp) {

        var i = 1;
        var resultSet = $('RESULTSET', resp);

        $('#yubin').html("");
        $('#todofuken').html("");
        $('#chomeibantitatemono').html("");
        if ($('FIELD[NAME = ERR_MSG]', resultSet).text() != "") {
        	$('#yubin').html($('FIELD[NAME = ERR_MSG]', resultSet).text());
        } else if ($('FIELD[NAME = ZIP_CD1]', resultSet).text() != "") {
            var zip1 = $('FIELD[NAME = ZIP_CD1]', resultSet).text();
            var zip2 = $('FIELD[NAME = ZIP_CD2]', resultSet).text();
            var todofukenCd = $('FIELD[NAME = TODOFUKEN_CD]', resultSet).text();
            var todofuken = $('FIELD[NAME = TODOFUKEN]', resultSet).text();
            var shigunkuCd = $('FIELD[NAME = SHIGUNKU_CD]', resultSet).text();
            var shigunku = $('FIELD[NAME = SHIGUNKU]', resultSet).text();
            var ooaza = $('FIELD[NAME = OOAZA]', resultSet).text();
            var chome = $('FIELD[NAME = CHOME]', resultSet).text();

            this.lockShikugun = 'Locked';
            if (zip1 != null) {
                this.tmpelmZipCd1.attr("value", zip1);
            }
            if (zip2 != null) {
                this.tmpelmZipCd2.attr("value", zip2);
            }
            if (todofukenCd != null) {
                this.tmpelmTdfCd.attr("value", todofukenCd);
            }
            if (shigunkuCd != null) {
                this.createSikugun(shigunkuCd, todofukenCd);
            }
            if (ooaza + chome != null) {
                this.tmpelmJShsi.attr("value", ooaza + chome);
            }
            this.lockShikugun = null;

        } else {
            this.tmpelmTdfCd.attr("value", "");
            this.tmpelmSgkCd.attr("value", "");
            this.tmpelmJShsi.attr("value", "");
        }
    },


    /**
     * スマホ最適化非同期郵便番号住所検索のコールバックイベント
     * (郵便番号フォーム7桁用）
     */
    smpShiryoCallbackZipSearch : function(resp) {

        var i = 1;
        var resultSet = $('RESULTSET', resp);

        $('#yubin').html("");
        $('#todofuken').html("");
        $('#chomeibantitatemono').html("");
        if ($('FIELD[NAME = ERR_MSG]', resultSet).text() != "") {
        	$('#yubin').html($('FIELD[NAME = ERR_MSG]', resultSet).text());
        } else if ($('FIELD[NAME = ZIP_CD1]', resultSet).text() != "") {
            var zip1 = $('FIELD[NAME = ZIP_CD1]', resultSet).text();
            var zip2 = $('FIELD[NAME = ZIP_CD2]', resultSet).text();
            var todofukenCd = $('FIELD[NAME = TODOFUKEN_CD]', resultSet).text();
            var todofuken = $('FIELD[NAME = TODOFUKEN]', resultSet).text();
            var shigunkuCd = $('FIELD[NAME = SHIGUNKU_CD]', resultSet).text();
            var shigunku = $('FIELD[NAME = SHIGUNKU]', resultSet).text();
            var ooaza = $('FIELD[NAME = OOAZA]', resultSet).text();
            var chome = $('FIELD[NAME = CHOME]', resultSet).text();

            this.lockShikugun = 'Locked';
            if (zip1 != null && zip2 != null) {
                this.tmpelmZipCd.attr("value", String(zip1) + String(zip2));
            }
            if (todofukenCd != null) {
                this.tmpelmTdfCd.attr("value", todofukenCd);
            }
            if (shigunkuCd != null) {
                this.createSikugun(shigunkuCd, todofukenCd);
            }
            if (ooaza + chome != null) {
                this.tmpelmJShsi.attr("value", ooaza + chome);
            }
            this.lockShikugun = null;

        } else {
            this.tmpelmTdfCd.attr("value", "");
            this.tmpelmSgkCd.attr("value", "");
            this.tmpelmJShsi.attr("value", "");
        }
    },

    /**
     * 住所リストをクリアする
     */
    clearSuggest : function() {
      if (this.elmAddressList != undefined && this.elmAddressList != null){
        this.elmAddressList.html("");
        this.elmAddressList.hide();
      }
    },

    /**
     * 住所候補選択時処理
     */
    doSelection : function(index){

        this.lockShikugun = 'Locked';
            if (this.aryZip1[index-1] != null) {
                this.tmpelmZipCd1.attr("value", this.aryZip1[index-1]);
            }
            if (this.aryZip2[index-1] != null) {
                this.tmpelmZipCd2.attr("value", this.aryZip2[index-1]);
            }
            if (this.aryTodofuken[index-1] != null) {
                this.tmpelmTdfCd.attr("value", this.aryTodofuken[index-1]);
            }
            if (this.aryShigunku[index-1] != null) {
                this.createSikugun(this.aryShigunku[index-1], this.aryTodofuken[index-1]);
            }
            if (this.aryJusho[index-1] != null) {
                this.tmpelmJShsi.attr("value", this.aryJusho[index-1]);
				if (this.isBrowserHasW3C == true) {
					if (typeof txChangeFF == "function")
						txChangeFF(this.tmpelmJShsi.attr("id"));
				}
            }
        this.lockShikugun = null;

    },

    /**
     * プルダウンに市区郡を設定
     * val : プルダウン初期選択値（市区郡コード)
     * tfval : 都道府県の選択値（都道府県コード)
     */
    createSikugun : function(val, tfval) {
        this.tmpSelectZipShikugunCd = val;

        $.ajax({
            type: "GET",
            url: this.zipAppcontext + "/common/function/JJ901FL118/",
            data: "tf=" + tfval,
            success: $.functionScope(this, this.callbackZipShikugunSearch)
        });

        this.zipAppcontext = null;
    },

    /**
     * 非同期市区郡検索のコールバックイベント
     */
    callbackZipShikugunSearch : function(resultData) {

        var i = 1;

        this.zipShikugunNmList = new Array();
        this.zipShikugunCdList = new Array();

        this.tmpelmSgkCdSel.value = "";

        var resultSet = $('RESULTSET', resultData);
        var jusho = $('JUSHO[NO = "'+ i+'"]', resultSet);
        var shikugunCd;

        if (jusho != null) {
            while (true) {
                jusho = $('JUSHO[NO = "'+ i+'"]', resultSet);
                shikugunCd = $('FIELD[NAME = SHIKUGUN_CD]',jusho).text();
                if(shikugunCd == "") break;
                this.zipShikugunCdList[i-1] = shikugunCd;
                this.zipShikugunNmList[i-1] = $('FIELD[NAME = SHIKUGUN_NM]',jusho).text();
                i++;
            }

            this.createZipSikugun();
        } else {
            this.tmpelmSgkCd.attr("value", "");
        }

        this.lockShikugun = null;
        this.tmpSelectZipShikugunCd = null;
    },

    /**
     * 市区郡プルダウンに取得した市区郡リストを設定
     */
    createZipSikugun : function() {
        var selected = "";
        // １行目を設定
        var sgkcd = this.tmpelmSgkCd;

        // 市町村を初期化
        sgkcd.get()[0].length = 0;

        sgkcd.get()[0].options[0] = new Option();
        sgkcd.get()[0].options[0].text = "市区郡を選択";
        sgkcd.get()[0].options[0].value = "";

        for (j = 0; j < this.zipShikugunCdList.length ; j++) {

            if (this.tmpSelectZipShikugunCd != null) {
                if (this.tmpSelectZipShikugunCd == this.zipShikugunCdList[j]) {
                    selected = "selected";
                    this.tmpelmSgkCdSel.value = this.zipShikugunCdList[j];
                } else {
                    selected = "";
                }
            }
            this.tmpelmSgkCd.append($('<option value ="' + this.zipShikugunCdList[j] +  '" ' + selected + '>' + this.zipShikugunNmList[j] +  '</option>'));
        }
    },

   /**
    *
    */
    suumoSetup : function(elmZipCd, elmTmpZipCd, elmTdfCd, elmSgkCd, elmJShsi, elmAdrl, elmSgkCdSel, variableName) {

       this.variableName = variableName;

       this.tmpelmZipCd = elmZipCd;
       this.tmpelmTmpZipCd = elmTmpZipCd;
       this.tmpelmTdfCd = elmTdfCd;
       this.tmpelmSgkCd = elmSgkCd;
       this.tmpelmJShsi = elmJShsi;

       this.elmAddressList = elmAdrl;
       this.elmAddressList.hide();

       this.tmpelmSgkCdSel = elmSgkCdSel;

       if ($.browser.msie)
       	this.isBrowserHasW3C = false;
       else
       	this.isBrowserHasW3C = true;

   },

   /**
    * auto住所を検索する
    */
   suumoAutoSearchZip : function(appcontext) {
       if (this.lockZip == 'locked'){
           return false;
       }

       // 郵便番号検索機能の実行中ロックON
       this.lockZip ='locked';

       // 郵便番号コード取得
       var zip = this.tmpelmZipCd.attr("value");
       var zip1 = zip.substring(0,3);
       var zip2 = zip.substring(3,7);

       this.clearSuggest();

       if (appcontext == "/") {
           appcontext = "";
       }

       this.zipAppcontext = appcontext;
       $.ajax({
           type: "GET",
           url: appcontext + "/common/function/JJ901FL017/",
           data: "zipcd1=" + zip1 + "&zipcd2=" + zip2,
           success: $.functionScope(this, this.suumoAutoCallbackZipSearch),
           error: function() {
        	   alert("該当する住所がありません");
           }
       });
       // 郵便番号検索機能の実行中ロックOFF
       this.lockZip ='';

       return false;
   },

   suumoAutoCallbackZipSearch : function(resp) {
       if (this.lockZipView == 'locked'){
           return false;
       }

       this.lockZipView == 'locked';
       this.elmAddressList.html("");

       var i = 1;
       var resultSet = $('RESULTSET', resp);
       var jusho = $('JUSHO[NO = "' + i + '"]', resultSet);

       if ($('FIELD[NAME = ZIP_CD1]', jusho).text() != "") {
           while (true) {
               jusho = $('JUSHO[NO = "' + i + '"]', resultSet);
               var zip1 = $('FIELD[NAME = ZIP_CD1]', jusho).text();
               if (zip1 == "") break;
               var zip2 = $('FIELD[NAME = ZIP_CD2]', jusho).text();
               var todofukenCd = $('FIELD[NAME = TODOFUKEN_CD]', jusho).text();
               var todofuken = $('FIELD[NAME = TODOFUKEN]', jusho).text();
               var shigunkuCd = $('FIELD[NAME = SHIGUNKU_CD]', jusho).text();
               var shigunku = $('FIELD[NAME = SHIGUNKU]', jusho).text();
               var ooaza = $('FIELD[NAME = OOAZA]', jusho).text();
               var chome = $('FIELD[NAME = CHOME]', jusho).text();

               var item = zip1 + "-"
                       + zip2 + "&nbsp"
                       + todofuken
                       + shigunku
                       + ooaza
                       + chome;

               if (item != "") {
                   var a = '<a href="javascript:void(0);" onkeyup="if (event.keyCode == 13) { '
                       + this.variableName + '.suumoDoSelection(' + i + '); '
                       + this.variableName + '.clearSuggest();}" onmouseup="'
                       + this.variableName + '.suumoDoSelection(' + i + ');'
                       + this.variableName + '.clearSuggest();' + '">' + item + '</a>';
                   this.elmAddressList.append(a);
               }
               this.aryZip1[i-1] = zip1;
               this.aryZip2[i-1] = zip2;
               this.aryTodofuken[i-1] = todofukenCd;
               this.aryShigunku[i-1] = shigunkuCd;
               this.aryJusho[i-1] = ooaza + chome;
               i++;
           }
           if (i == 2) {
               this.lockShikugun = 'Locked';
               if (this.aryZip1[0] != null && this.aryZip2[0] != null) {
                   this.tmpelmZipCd.attr("value", this.aryZip1[0] + this.aryZip2[0]);
                   this.tmpelmTmpZipCd.attr("value", this.aryZip1[0] + this.aryZip2[0]);
               }
               if (this.aryTodofuken[0] != null) {
                   this.tmpelmTdfCd.attr("value", this.aryTodofuken[0]);
               }
               if (this.aryShigunku[0] != null) {
                   this.createSikugun(this.aryShigunku[0], this.aryTodofuken[0]);
               }
               if (this.aryJusho[0] != null) {
                   this.tmpelmJShsi.focus();
                   this.tmpelmJShsi.attr("value", this.aryJusho[0]);

                   if (this.isBrowserHasW3C == true) {
                       if (typeof txChangeFF == "function") {
                           txChangeFF(this.tmpelmJShsi.attr("id"));
                       }
                   }
               }
               this.lockShikugun = null;
           } else {
               this.elmAddressList.show();
           }
           // 郵便番号テキストからfocusが外れた場合、suggestlistを消す
           document.onmouseup = $.functionScope(this, this.clearSuggest);

       } else {
           this.tmpelmTdfCd.attr("value", "");
           this.tmpelmSgkCd.attr("value", "");
           this.tmpelmJShsi.attr("value", "");

           if (this.isBrowserHasW3C == true) {
               if (typeof txChangeFF == "function") {
                   txChangeFF(this.tmpelmJShsi.attr("id"));
               }
           }
       }
       this.lockZipView ='';
   },

   /**
    * 住所候補選択時処理
    */
   suumoDoSelection : function(index){

       this.lockShikugun = 'Locked';
           if (this.aryZip1[index-1] != null && this.aryZip2[index-1] != null) {
               this.tmpelmZipCd.attr("value", this.aryZip1[index-1] + this.aryZip2[index-1]);
               this.tmpelmTmpZipCd.attr("value", "-------");
           }
           if (this.aryTodofuken[index-1] != null) {
               this.tmpelmTdfCd.attr("value", this.aryTodofuken[index-1]);
           }
           if (this.aryShigunku[index-1] != null) {
               this.createSikugun(this.aryShigunku[index-1], this.aryTodofuken[index-1]);
           }
           if (this.aryJusho[index-1] != null) {
               this.tmpelmJShsi.focus();
               this.tmpelmJShsi.attr("value", this.aryJusho[index-1]);

               if (this.isBrowserHasW3C == true) {
                   if (typeof txChangeFF == "function") {
                       txChangeFF(this.tmpelmJShsi.attr("id"));
                   }
               }
           }
       this.lockShikugun = null;
   }

};