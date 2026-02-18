(function($) {
    $(function(){
        //エラー時の表示メッセージ定義
        var validateMessages = {
            required: "【注】入力されていません。",
            requiredMultiText: "【注】入力されていません。",
            requiredMultiSelect: "【注】未選択です。",
            requiredMultiCheck: "【注】未選択です。",
            requiredAskSeltxt: "【注】上記チェックボックスにチェックを入れた際は、詳細を入力してください。",
            requiredContactTel: "【注】「連絡方法・電話」にチェックを入れた際は、電話番号を入力してください。",
            requiredContactFax: "【注】「連絡方法・FAX」にチェックを入れた際は、FAX番号を入力してください。",
            requiredRsvDate: "【注】第１希望の見学日時を入力してください。",
            requiredRsvDateSub: "【注】第２希望の見学日時を入力してください。",
            // Mantis0039369対応start
            requiredMustin: "【注】入力されていません。",
            // Mantis0039369対応end
            //email: "【注】正しいメールアドレスが入力されていません。"
            requiredRaihouDate: "【注】見学希望日を入力してください。"
        };

        //validateの独自メソッド定義
        var validateMethods = {
            requiredMultiText: validateCommonMethod,
            requiredMultiSelect: validateCommonMethod,
            requiredMultiCheck: validateCommonMethod,
            requiredAskSeltxt: validateAskSeltxt_Method,
            requiredContactTel: validateContactTel_Method,
            requiredContactFax: validateContactFax_Method,
            requiredRsvDate: validateRsvDate_Method,
            requiredRsvDateSub: validateRsvDateSub_Method,
            // Mantis0039369対応start
            requiredMustin: validateMustinCommonMethod,
            // Mantis0039369対応end
            requiredRaihouDate: validateRaihouDate_Method
        };

        //フォーム要素にフォーカスしたかどうかを格納するハッシュ
        var validateFocusFlg = {};

        // 買い替えフラグパターン判定
        var isSumaiKbnRadio = $('#jsSumaiKbn').length > 0;

        // エラーメッセージ変数
        var bukkenUmuErrorMessage = "「お持ちの物件について」は必須です。";
        var baikyakuIkoErrorMessage = "「お持ちの物件の売却予定」は必須です。";

        if (isSumaiKbnRadio) {
            bukkenUmuErrorMessage = "【注】選択されていません。";
            baikyakuIkoErrorMessage = "【注】選択されていません。";
        }

        //validatetorに独自メソッド、エラーメッセージを追加
        for (var i in validateMethods) {
            var x = validateMethods[i];
            jQuery.validator.addMethod(i, x, "[E] Message not set.");
        }
        $.each(validateMessages, function(i, val) { validateMessages[i] = $.format(val); });
        jQuery.extend(jQuery.validator.messages, validateMessages);

        //validatorにclassによるルールを追加
        jQuery.validator.addClassRules({
            required: { required: true },
            required_multi_text: { requiredMultiText: true },
            required_multi_select: { requiredMultiSelect: true },
            required_multi_check: { requiredMultiCheck: true },
            required_AskSeltxt: { requiredAskSeltxt: true },
            required_ContactTel: { requiredContactTel: true },
            required_ContactFax: { requiredContactFax: true },
            required_RsvDate: { requiredRsvDate: true },
            required_RsvDateSub: { requiredRsvDateSub: true },
            // Mantis0039369対応start
            requiredMustin: {requiredMustin: true},
            // Mantis0039369対応end
            required_RaihouDate: { requiredRaihouDate: true }
        });

        //validatorのデフォルトを設定する
        jQuery.validator.setDefaults({
            onclick: false,
            onkeyup: false,
            onfocusout: false,
            errorElement: "p",
            errorPlacement: function(error, element) {
                var errorPlacementAttr = element.attr("data-validation-error-target");
                var $errorPlacement = errorPlacementAttr !== undefined ? $(errorPlacementAttr) : $($(element).parents('td')[0]);
                $errorPlacement.prepend(error);
            },
            highlight: function(element, errorClass) {
                var parentTd = $($(element).parents('td')[0]);
                if(element.type == "checkbox" || element.type == "radio"){
                    if (isSumaiKbnRadio) {
                        setErrorSumaiKbn(parentTd, this.errorList.length !== 0);
                    } else {
                        setError(parentTd, this.errorList.length !== 0);
                    }
                    return false;
                }
                parentTd.parent("tr").addClass("has_error");
                parentTd.removeClass("validate_ok");
            },
            unhighlight: function(element, errorClass) {
                var parentTd = $($(element).parents('td')[0]);
                if(element.type == "checkbox" || element.type == "radio"){
                    if (isSumaiKbnRadio) {
                        setErrorSumaiKbn(parentTd, this.errorList.length !== 0);
                    } else {
                        setError(parentTd, this.errorList.length !== 0);
                    }
                    return false;
                }
                parentTd.parent("tr").removeClass("has_error");
            },
            success: function(label) {
                var grp = $(label).attr("htmlfor");
                var cnt = 0;
                var parentTd = $(label).parent("td");
                parentTd.find("." + grp).each(function(){
                    if(validateFocusFlg[$(this).attr("name")]) { cnt++	}
                });
                if(parentTd.find("." + grp).size() == cnt || $(parentTd.find("." + grp)[0]).attr("type") == "checkbox") {
                    if(parentTd.hasClass('non_ok')){
                        parentTd.removeClass('non_ok');
                    }else{
                        parentTd.addClass("validate_ok");
                    }
                }
            },
            // Mantis0039369対応start
            messages: {
                seikanji: "【注】入力されていません。",
                meikanji: "【注】入力されていません。",
                seikana: "【注】入力されていません。",
                meikana: "【注】入力されていません。",
                ybo: "【注】入力されていません。",
                ybk: "【注】入力されていません。",
                jushoshosai: "【注】入力されていません。",
                jushotatemonomei: "【注】入力されていません。",
                email: "【注】入力されていません。",
                telno1: "【注】入力されていません。",
                telno2: "【注】入力されていません。",
                telno3: "【注】入力されていません。",
                kiboujikantai:"【注】入力されていません。",
                seimeikanji: "【注】入力されていません。",
                yb: "【注】入力されていません。",
                jushoshosaitatemonomei: "【注】入力されていません。",
                bukkenzipcd: "【注】入力されていません。",
                bukkenshosaitatemonomei: "【注】入力されていません。",
                msmadoritype: "【注】入力されていません。",
                mschikugonen: "【注】入力されていません。",
                mstatemonomenseki: "【注】入力されていません。",
                kdmadoritype: "【注】入力されていません。",
                kdchikugonen: "【注】入力されていません。",
                kdtochimenseki: "【注】入力されていません。",
                tottochimenseki: "【注】入力されていません。",
                faxno1: "【注】入力されていません。",
                faxno2: "【注】入力されていません。",
                faxno3: "【注】入力されていません。",
                renrakuyoubijikan: "【注】入力されていません。",
                telno: "【注】入力されていません。",
                // エラーメッセージを変数化
                sumaiKbn: bukkenUmuErrorMessage,
                baikyakuIko: baikyakuIkoErrorMessage,
            }
        });
            // Mantis0039369対応end

        //validateの独自判定メソッド
        function validateCommonMethod(value, element) {
            var classes = $(element).attr("class").split(" ");
            for(i = 0; i < classes.length; i++) {
                if(classes[i].indexOf("grp") == 0) {
                    var c = classes[i];
                    break;
                }
            }
            var parentTd = $($(element).parents('td')[0]);
            if(element.type == "checkbox") {
                return parentTd.find("." + c + ":checked").size() > 0;
            } else {
                var tmp = parentTd.find("." + c + ":filled").filter(checkFocus);
                var inp = 0;
                $.each(tmp, function(){
                    if($(this).val()!=$(this).attr('lang')) inp++;
                });
                return parentTd.find("." + c).filter(checkFocus).size() == inp;
            }
        }
            // Mantis0039369対応start
        function validateMustinCommonMethod(value, element) {
            var classes = $(element).attr("class").split(" ");
            for(i = 0; i < classes.length; i++) {
                if(classes[i].indexOf("grp") == 0) {
                    var c = classes[i];
                    break;
                }
            }
            var parentTd = $($(element).parents('td')[0]);
            if(element.type == "checkbox") {
                return parentTd.find("." + c + ":checked").size() > 0;
            } else {
                var tmp = parentTd.find("." + c + ":filled").filter(checkFocus);
                var inp = 0;
                $.each(tmp, function(){
                    if($(this).val()!=$(this).attr('title')) inp++;
                });
                return parentTd.find("." + c).filter(checkFocus).size() == inp;
            }
        }
            // Mantis0039369対応end


        function validateAskSeltxt_Method(value, element){
            var parentTd = $($(element).parents('td')[0]);
            var chk = $(element).parent().parent().find('input[type=checkbox]:checked');
            if(chk.length>0 && value==""){
                return false;
            }else{
                if(parentTd.find('input[type=checkbox]:checked').length==0){
                    parentTd.addClass('non_ok').removeClass('validate_ok');
                }
                return true;
            }
        }
        function validateRsvDate_Method(value, element){
            var parentTd = $($(element).parents('td')[0]);
            var $this = $(element);
            var num = $this.attr('id').substr($this.attr('id').length-1);
            var date = $('input#date' + num);
            var time = $('input#time' + num);
            if(date.val()!='' && date.val()!=date.attr('lang') && time.val()!='' && time.val()!=time.attr('lang')){
                parentTd.removeClass('non_ok');
                return true;
            }else if($this.attr('id')!='time' + num && (time.val()=='' || time.val()==time.attr('lang'))){
                parentTd.addClass('non_ok');
                return true;
            }else{
                return false;
            }
        }
        function validateRsvDateSub_Method(value, element){
            var parentTd = $($(element).parents('td')[0]);
            var $this = $(element);
            var num = $this.attr('id').substr($this.attr('id').length-1);
            var date = $('input#date' + num);
            var time = $('input#time' + num);
            if(date.val()!='' && date.val()!=date.attr('lang') && time.val()!='' && time.val()!=time.attr('lang')){
                parentTd.removeClass('non_ok');
                return true;
            }else if($this.attr('id')=='time' + num && (date.val()!='' && date.val()!=date.attr('lang'))){
                return false;
            }else{
                parentTd.addClass('non_ok');
                return true;
            }
        }
        // MS見学希望日入力チェック
        function validateRaihouDate_Method(value, element){
            var parentTd = $($(element).parents('td')[0]);
            var $this = $(element);
            var raihouDate = $('input#raihouDate');
            if(raihouDate.val()!='' && raihouDate.val()!=raihouDate.attr('lang')){
            	return true;
            }else {
                return false;
            }
        }
        function validateContactTel_Method(value, element){
            var parentTd = $($(element).parents('td')[0]);
            return chkExtInput('tel', parentTd);
        }
        function validateContactFax_Method(value, element){
            var parentTd = $($(element).parents('td')[0]);
            return chkExtInput('fax', parentTd);
        }
        function chkExtInput(type, parentTd){
            var flg = true;
            var chk = $('input#cnt_' + type + ':checked');
            var vals = parentTd.find('#' + type + '1,#' + type + '2,#' + type + '3');
            $.each(vals, function(){
                if($(this).val()==''){flg = false;return false;}
            });
            if(flg){
                parentTd.addClass('validate_ok');
                return true;
            }else{
                parentTd.removeClass('validate_ok');
                if(chk.length>0){
                    return false;
                }else{
                    parentTd.addClass('non_ok');
                    return true;
                }
            }
        }

        // KR_DEV-6209
        // highlight / unhighlight の引数 element に入ってくるラジオボタンと、バリデーション対象として保持されるラジオボタンが異なる。（エラー文言を出すshowErrorsの判定に使われる要素が異なる）
        function setError(parentTd, hasError){
            if(parentTd.find('input[type=radio]:checked:visible, input[type=checkbox]:checked:visible').length==0 && hasError){
                parentTd.parent("tr").addClass("has_error");
                parentTd.removeClass("validate_ok");
            } else {
                parentTd.parent("tr").removeClass("has_error");
            }
        }

        // 表示中ラジオボタンのエラー表示制御
        function setErrorSumaiKbn(parentTd, hasError){
            var $allRadioButtons = parentTd.find("input[type=radio].required");
            var $visibleRadioButtons = $allRadioButtons.filter(":visible");
            var $tr = parentTd.parent("tr");
            var isBaikyakuIkoError = $("#jsBaikyakuIkoError").find('.error').text().length > 0;
            var visibleGroupNames = $visibleRadioButtons.get().reduce(function(acc, cur) {
                var name = cur.getAttribute("name");
                if (acc.indexOf(name) === -1) {
                    acc.push(name);
                }
                return acc;
            }, []);

            $tr.toggleClass("has_error", hasError || isBaikyakuIkoError);

            // 表示されている必須のラジオボタングループ（name属性）と checked の数が合っているかでエラーを表示
            parentTd.toggleClass("validate_ok", $visibleRadioButtons.filter(":checked").length === visibleGroupNames.length);
        }

        //filterのコールバック
        function checkFocus() {
            return validateFocusFlg[$(this).attr("name")] == true;
        }

        //ブラー時にvalidateする
        function validateOnBlur(selector) {
            $(selector).find(":input").filter("[class*='required']").not(":checkbox").each(function() {
                $(this).blur(function() {
                    $(this).valid();
                });
            });
        }

        //checkbox、radioのときはクリック時にvalidateする
        function validateOnClick(selector) {
            $(selector).find(":checkbox, :radio").filter("[class*='required']").each(function() {
                $(this).click(function() {
                    $(this).valid();
                });
            });
        }

        //classからグループ適用のためのハッシュ生成
        function getGroups(selector) {
            var elm = $(selector).find("[class*='grp']");
            var grpClass = [];
            elm.each(function(i){
                var classes = $(this).attr("class").split(" ");
                for(j = 0; j < classes.length; j++) {
                    if(classes[j].indexOf("grp") == 0) {
                         var c = classes[j];
                         if(grpClass[grpClass.length - 1] != c) { grpClass.push(c) }
                    }
                }
            });
            var groups = {};
            for(i = 0; i < grpClass.length; i++) {
                var grpElm = $(selector).find("[class*=" + grpClass[i]+ "]");
                var grpNameArr = [];
                grpElm.each(function() {
                    grpNameArr.push($(this).attr("name"));
                });
                groups[grpClass[i]] = grpNameArr.join(" ");
            }
            return groups;
        }

        //フォーカスしたかどうかを調べる
        function getFocusFlg(selector) {
            $(selector).find(":input").filter("[class*='grp']").each(function() {
                $(this).focus(function() {
                    validateFocusFlg[$(this).attr("name")] = true;
                });
            });
        }

        //ロード完了時に実行する処理
        $.validateInit = function(selector) {
            var itemGroups = getGroups(selector);
            $(selector).validate({ groups: itemGroups });
            validateOnBlur(selector);
            validateOnClick(selector);
            getFocusFlg(selector);
        }

        //郵便番号で住所を検索
        $(".js_search_address").click(function() {
            var box = $($(this).attr("href"));
            if(box.filter(':hidden').size()) {
                box.show();
                $("body").bind("click", box, hideAddressList);
            } else {
                box.hide();
                $("body").unbind("click", hideAddressList);
            }
            return false;
        });

        function hideAddressList(e) {
            e.data.hide();
            $("body").unbind("click", hideAddressList);
        }

        // お住まいの種類の売却予定 アコーディオン
        $("#jsSumaiKbn").find("input[type='radio']").click(function() {
            var $this = $(this);
            var $toggleTarget = $("#jsBaikyakuIko");
            var $kbnGroup = $toggleTarget.find(".js_baikyaku_iko_group");
            var toggleId = $this.attr("data-validation-toggle");

            var $hiddenKbnGroup = $kbnGroup.not("[data-toggle-id='" + toggleId + "']");
            var $visibleKbnGroup = $kbnGroup.filter("[data-toggle-id='" + toggleId + "']");

            if ($toggleTarget.hasClass("is-disabled")) {
                $toggleTarget.removeClass("is-disabled");
            }

            if (!$hiddenKbnGroup.hasClass("is-hidden")) {
                $hiddenKbnGroup.find("input[type='radio']").attr('checked', false);
            }

            $hiddenKbnGroup.addClass("is-hidden");
            $visibleKbnGroup.removeClass("is-hidden");

            $hiddenKbnGroup.find("input[type='radio']").attr("disabled", true);
            $visibleKbnGroup.find("input[type='radio']").attr("disabled", false);
        });
    });
})(jQuery);