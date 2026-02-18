if ( "undefined" == typeof(SUUMO) || !SUUMO ) {
    var SUUMO = {};
}
SUUMO.KR_SHIRYOSEIKYU = {
    // 入力チェック
    initValidate: function() {
        if ($('#contact_form').size() === 1) {
            $.validateInit("#contact_form");
        }
    },
    // 電話番号をFAXへコピー
    faxCheck: function() {
        var tel1 = $('#jsiTelNum1');
        var tel2 = $('#jsiTelNum2');
        var tel3 = $('#jsiTelNum3');
        var fax1 = $('#jsiFaxNum1');
        var fax2 = $('#jsiFaxNum2');
        var fax3 = $('#jsiFaxNum3');
        if($('#jsiTelToFax').attr('checked')) {
            fax1.attr('value',tel1.val());
            fax2.attr('value',tel2.val());
            fax3.attr('value',tel3.val());
        }
    },
    // 問い合わせ内容入力チェック
    inquiryCheck: function() {
        var inq1 = $('#jsiInq1');
        var inq2 = $('#jsiInq2');
        var inq3 = $('#jsiInq3');
        var inq4 = $('#jsiInq4');
        var inq5 = $('#jsiInq5');
        var inq6 = $('#jsiInq6');
        var inqComment = $('#jsiInqComment');
        var inqEr = $('#jsiInquiry');
        var inqErMsg = $('#jsiInquiryErrorMsg');
        var miMsg = $('#jsiInqCaution');

        if (!inq1.attr('checked')
                && !inq2.attr('checked')
                && !inq3.attr('checked')
                && !inq4.attr('checked')
                && !inq5.attr('checked')
                && !inq6.attr('checked')
                && inqComment.val() == "") {
            inqEr.addClass('has_error');
            inqErMsg.removeClass('validate_ok');
            miMsg.show();
        } else {
            inqEr.removeClass('has_error');
            inqErMsg.addClass('validate_ok');
            miMsg.hide();
        }
    },
    // プロフィール画面遷移
    postActionProfile: function() {
        var objForm = document.getElementById("contact_form");
        // Mantis0039369対応start
        $(objForm).find(".js_exmple").each(function(){
            if($(this).val()==$(this).attr("title"))
            this.value="";
        });
        // Mantis0039369対応end
        objForm.action = SUUMO.KR_COMMON_CONFIG.ctx + '/bukken/shiryou/JJ010FG210/';
        var objProfile = document.createElement("Input");
        objProfile.type = "hidden";
        objProfile.name = "profile";
        objProfile.value = "profile";
        objForm.appendChild(objProfile);
        if( $("#jsiTurnbackinfo").val() == "" ){
             $("#jsiTurnbackinfo").attr("value",$("div.turnbackinfo > :input").val());
         }
        if ($(this).attr("id") == "jsDspProfile01" && !$("#autoInsertFlg").attr('checked')) {
            var objAutoInsertFlg = document.createElement("Input");
            objAutoInsertFlg.type = "hidden";
            objAutoInsertFlg.name = "autoInsertFlg";
            objAutoInsertFlg.value = "";
            objForm.appendChild(objAutoInsertFlg);
        }
        objForm.submit();
        return false;
    },
    // 確認画面遷移
    postActionKakunin: function() {
        if (SUUMO.KR_SHIRYOSEIKYU.isSubmit()) {
            return;
        }

        var objForm = document.getElementById("contact_form");
        // Mantis0039369対応start
        $(objForm).find(".js_exmple").each(function(){
            if($(this).val()==$(this).attr("title"))
            this.value="";
        });

        // 行動履歴kiss、recinfo、nc項目追加する
        var recParDispFlg = false;
        $(objForm).find('.js-onCheck-input:checkbox[checked]').each(function(){
            recParDispFlg = true;
        });
        if(recParDispFlg){
            var separator = "";
            var ruleId = $(objForm).find('input:hidden[name=recommendIdInput]').val();
            var recInfo = "orig";
            var orignal = "";
            $(objForm).find('input:hidden[name=snc]').each(function(){
                var kissCd = $(this).parents('.jsbukkenInfo').find('input:hidden[name=kissCd]').val();
                var kissCdAutoInsertFlg = document.createElement("Input");
                kissCdAutoInsertFlg.type = "hidden";
                kissCdAutoInsertFlg.name = "kiss";
                kissCdAutoInsertFlg.value = kissCd;
                objForm.appendChild(kissCdAutoInsertFlg);
                recInfo = recInfo+separator+orignal;
                orignal = "orig";
                separator = "_"
            });
            $(objForm).find('.js-onCheck-input:checkbox[checked]').each(function(){
                var nc = $(this).val().substr(3,8);
                var ncAutoInsertFlg = document.createElement("Input");
                ncAutoInsertFlg.type = "hidden";
                ncAutoInsertFlg.name = "nc";
                ncAutoInsertFlg.value = nc;
                objForm.appendChild(ncAutoInsertFlg);
                recInfo =recInfo+"_"+ruleId+"@rec"
                var kissCd = $(this).parents('.js-carousel-area').find('input:hidden[name=kissCd]').val();
                var kissCdAutoInsertFlg = document.createElement("Input");
                kissCdAutoInsertFlg.type = "hidden";
                kissCdAutoInsertFlg.name = "kiss";
                kissCdAutoInsertFlg.value = kissCd;
                objForm.appendChild(kissCdAutoInsertFlg);
                });
            var recAutoInsertFlg = document.createElement("Input");
            recAutoInsertFlg.type = "hidden";
            recAutoInsertFlg.name = "recinfo";
            recAutoInsertFlg.value = recInfo;
            objForm.appendChild(recAutoInsertFlg);
        }

        // Mantis0039369対応end
        objForm.action = SUUMO.KR_COMMON_CONFIG.ctx + '/bukken/shiryou/JJ010FG220/';
        if( $("#jsiTurnbackinfo").val() == "" ){
             $("#jsiTurnbackinfo").attr("value",$("div.turnbackinfo > :input").val());
         }
        if (($(this).attr("id") == "jsDspKakunin1" || $(this).attr("id") == "jsDspKakunin2") && !$("#autoInsertFlg").attr('checked')) {
            var objAutoInsertFlg = document.createElement("Input");
            objAutoInsertFlg.type = "hidden";
            objAutoInsertFlg.name = "autoInsertFlg";
            objAutoInsertFlg.value = "";
            objForm.appendChild(objAutoInsertFlg);
        }
        objForm.submit();
        return false;
    },
    // 入力画面前の画面に戻る
    postActionBack: function() {
        var objForm = document.getElementById("contact_form");
        objForm.action = SUUMO.KR_COMMON_CONFIG.ctx + '/common/common/JJ901FK001/';
        objForm.submit();
        return false;
    },
    // 完了画面遷移
    postActionKanryo: function() {
        if (SUUMO.KR_SHIRYOSEIKYU.isSubmit()) {
            return;
        }
        var objForm = document.getElementById("contact_form");

        // 行動履歴kiss、recinfo、nc項目追加する
        var recParDispFlg = false;
        $(objForm).find('.recomendCheck:checkbox[checked]').each(function(){
            recParDispFlg = true;
        });
        $(objForm).find('input:hidden[name=rncInput]').each(function(){
            recParDispFlg = true;
        });
        if(recParDispFlg){
            var separator = "";
            var recommendIdInput = $(objForm).find('input:hidden[name=recommendIdInput]').val();
            var recommendIdConfirm = $(objForm).find('input:hidden[name=recommendIdConfirm]').val();
            var recInfo = "orig";
            var orignal = "";
            $(objForm).find('input:hidden[name=nc]').each(function(){
                recInfo = recInfo+separator+orignal;
                orignal = "orig";
                separator = "_"
            });
            $(objForm).find('input:hidden[name=rncInput]').each(function(){
            	var nc = $(this).val().substr(3,8);
                var ncAutoInsertFlg = document.createElement("Input");
                ncAutoInsertFlg.type = "hidden";
                ncAutoInsertFlg.name = "nc";
                ncAutoInsertFlg.value = nc;
                objForm.appendChild(ncAutoInsertFlg);
                recInfo =recInfo+"_"+recommendIdInput+"@rec"
            });
            $(objForm).find('input:hidden[name=snc]').each(function(){
                var kissCd = $(this).parents('.jsbukkenInfo').find('input:hidden[name=kissCd]').val();
                var kissCdAutoInsertFlg = document.createElement("Input");
                kissCdAutoInsertFlg.type = "hidden";
                kissCdAutoInsertFlg.name = "kiss";
                kissCdAutoInsertFlg.value = kissCd;
                objForm.appendChild(kissCdAutoInsertFlg);
            });
            $(objForm).find('.recomendCheck:checkbox[checked]').each(function(){
                var nc = $(this).val();
                var ncAutoInsertFlg = document.createElement("Input");
                var contentsType = $(this).parents('.bukkenList').find('input:hidden[name=contentsType]').val();
                ncAutoInsertFlg.type = "hidden";
                ncAutoInsertFlg.name = "nc";
                ncAutoInsertFlg.value = nc;
                objForm.appendChild(ncAutoInsertFlg);
                recInfo =recInfo+"_"+recommendIdConfirm+"@"+contentsType
                var kissCd = $(this).parents('.bukkenList').find('input:hidden[name=kissCd]').val();
                var kissCdAutoInsertFlg = document.createElement("Input");
                kissCdAutoInsertFlg.type = "hidden";
                kissCdAutoInsertFlg.name = "kiss";
                kissCdAutoInsertFlg.value = kissCd;
                objForm.appendChild(kissCdAutoInsertFlg);
                });
            var recAutoInsertFlg = document.createElement("Input");
            recAutoInsertFlg.type = "hidden";
            recAutoInsertFlg.name = "recinfo";
            recAutoInsertFlg.value = recInfo;
            objForm.appendChild(recAutoInsertFlg);
        }

        objForm.action = SUUMO.KR_COMMON_CONFIG.ctx + '/bukken/shiryou/JJ010FG230/';
        objForm.submit();
        return false;
    },
    // 入力画面遷移
    postActionNyuryoku: function() {
        var objForm = document.getElementById("contact_form");
        if ($(this).attr("id") == "jsDspShuseiToNyuryoku01") {
            var objDisableAutoInsertFlg = document.createElement("Input");
            objDisableAutoInsertFlg.type = "hidden";
            objDisableAutoInsertFlg.name = "disableAutoInsertFlg";
            objDisableAutoInsertFlg.value = "1";
            objForm.appendChild(objDisableAutoInsertFlg);
        }
        objForm.action = SUUMO.KR_COMMON_CONFIG.ctx + '/bukken/shiryou/JJ010FG210/';
        objForm.submit();
        return false;
    },
    // 各種トップ画面遷移
    postActionTop: function() {
        var objForm = document.getElementById("contact_form");
        objForm.action = $("#jsiTopUrl").val() + '/common/top/JJ901FJ003/';
        objForm.submit();
        return false;
    },
    // 物件詳細画面遷移
    postActionShosai: function() {
        var objForm = document.getElementById("contact_form");
        objForm.action = SUUMO.KR_COMMON_CONFIG.ctx + '/common/common/JJ901FK001/';
        objForm.submit();
        return false;
    },
    // （資料請求完了）会員登録情報入力画面遷移
    postActionKaiinToroku: function() {
        var objForm = document.getElementById("contact_form");
        objForm.action = SUUMO.KR_COMMON_CONFIG.ctx + '/bukken/shiryou/JJ010FG230/goKaiinToroku/';
        objForm.submit();
        return false;
    },
    // （資料請求後）会員情報更新画面遷移
    postActionKaiinKoshin: function() {
        var objForm = document.getElementById("contact_form");
        objForm.action = SUUMO.KR_COMMON_CONFIG.ctx + '/common/service/JJ901FM132/';
        objForm.submit();
        return false;
    },

    g_submitted : false,

    // 二重サブミット防止ファンクション
    isSubmit:function(){
        if(SUUMO.KR_SHIRYOSEIKYU.g_submitted){
            return true;
        }else{
            SUUMO.KR_SHIRYOSEIKYU.g_submitted = true;
            return false;
        }
    },

    //郵便番号検索
    zipSearch: function() {
        return zipSearchClient.searchZip(SUUMO.KR_COMMON_CONFIG.ctx);
    }
};

