if ( "undefined" == typeof(SUUMO) || !SUUMO ) {
var SUUMO = {};
}

SUUMO.KR_SHOSAI_COMMON = {

	krNyroModal: function(){
		var id = $(this).attr('id');
		var nyuroModalId = id.replace("jsiNyroModalId_", "");
		$(this).attr("href", nyuroModalId);
	},

	keydown : function(event) {
		if (event.keyCode == 13) {			//リターンキーかどうか判定
			var target = $(event.target);	//イベント発生オブジェクトを取得
			var cs = target.attr('class');
			if(cs.indexOf('nyroModal') > -1 || cs.indexOf('icLoupe') > -1){	//ライトボックス判別
				target.blur();				//フォーカスを喪失
				return false;
			}
		}
		return true;
	},

	popUp: function(action,popWidth,popHeight){
		var SubWindow = window.open(action,"krpopoup","width="+popWidth+",height="+popHeight+",toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=1");
		SubWindow.focus();
	},

	norikaePop: function(formName) {
		var SubWindow=window.open("about:blank", "compinfo", "width=600, height=550, toolbar=1, location=0, status=0, menubar=1, scrollbars=1, resizable=1");
		SubWindow.focus();
		document.forms[formName].submit();
		return false;
	},

	toiawaseNewWindow: function(action) {
		var newWindow = window.open( action, "blank" );
		newWindow.focus();
	},

	heikiNewWindow: function(action,popWidth,popHeight){
		var SubWindow = window.open(action,"krheikitel","width="+popWidth+",height="+popHeight+",toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=1");
		SubWindow.focus();
	},


	openNewWindow: function() {
		window.open( this.href, "blank" );
		return false;
	},

	openSubWindow: function() {
		window.open( this.href, "blank","width=780,top=0,left=0,toolbar=1,location=1,status=1,menubar=1,scrollbars=1,resizable=1");
		return false;
	},

	closeWindow: function(){
		window.close();
	},

	krPrint: function() {
		logPushPrintButton(51, null);
		print();
	},

	frontLogClickLink: function(linkType) {
		logClickLink(linkType);
	},

	frontLogClickLinkEx: function(linkType, linkKey) {
		logClickLinkEx(linkType, linkKey);
	},

	submittedFlg :false,

	mySubmitfunc:function(){
		if(SUUMO.KR_SHOSAI_COMMON.submittedFlg){
			alert('送信中');
			return false;
		  }else{
			SUUMO.KR_SHOSAI_COMMON.submittedFlg = true;
			return true;
		  }
	},

	bukkenshiryou: function() {
        var href = $(this).attr("href");
        var turHtml= $('<input type="hidden" name="turnbackinfo" value ="'+$("div.turnbackinfo > :input").val()+'"/>');
        var shiryouForm = $('<form action='+href+' method="post"></form>');
        shiryouForm.appendTo("body");
        $(turHtml).appendTo(shiryouForm);
        shiryouForm[0].submit();
        return false;
	},

	raijoyoyaku: function() {
        var href = $(this).attr("href");
        var turHtml= $('<input type="hidden" name="turnbackinfo" value ="'+$("div.turnbackinfo > :input").val()+'"/>');
        var raijoyoyakuForm = $('<form action='+href+' method="post"></form>');
        raijoyoyakuForm.appendTo("body");
        $(turHtml).appendTo(raijoyoyakuForm);
        raijoyoyakuForm[0].submit();
        return false;
	},

	registClip: function(jscContextRoot) {
		if (SUUMO.KR_SHOSAI_COMMON.mySubmitfunc()) {
	        $("#hidden_post").html("");
	        $("#clipMailError").html("&nbsp;");
	        $("#CLIP_MAIL").attr({value:""});
	        if (login) {
	            // 会員：検索条件登録
	            $(".mail_clp_change").attr({value:CLIP_KAIIN});
	        } else {
	            // 非会員：検索条件登録
	            $(".mail_clp_change").attr({value:CLIP_HIKAIIN});
	        }
	        // キー情報の取得
	        var val = $("#clipkey").attr("value");

	        // キー情報の取得結果により表示振分
	        if(val != "" && val != undefined) {
	            var objDiv = document.getElementById("hidden_post");
	            // 送信キー情報作成
	            createClipkey(objDiv, val);
	            // 非画面Ajax送信
	            ajaxSend(jscContextRoot + "/common/function/JJ901FL001/", "#contact_form_clip", "お気に入りに追加しました。");
	            SUUMO.KR_SHOSAI_COMMON.submittedFlg = false;
	        } else {
	            showResult("登録が行えませんでした。");
	        }
		}
	},

	// 価格更新お知らせメール
	registClipMailSingle:function(obj) {
			$("#hidden_post").html("");
			$("#clipMailError").html("&nbsp;");
			$("#CLIP_MAIL").attr({value:""});
			if (login) {
//				$(obj).unbind("click");
				$(".mail_clp_change").attr({value:CLIP_AND_MAIL_KAIIN});
				val = $("#clipkey").attr("value");
				if(val != "") {
					var objDiv = document.getElementById("hidden_post");
					createClipkey(objDiv, val);
					ajaxSend("/jj/common/function/JJ901FL001/", "#contact_form_clip", "お気に入りに追加しました。");
				}
			} else {
				$(".mail_clp_change").attr({value:CLIP_CHECK_MAIL});
				val = $("#clipkey").attr("value");
				if(val == "") {
				} else {
					var objTbi4dbs = document.createElement('input');
					objTbi4dbs.type = 'hidden';
					objTbi4dbs.name = 'tbi4dbs';
					objTbi4dbs.value = $('#js-turnbackPostForm [name=tbi4dbs]').val();

					var objAr = document.createElement("Input");
					objAr.type = "hidden";
					objAr.name = "ar";
					objAr.id = "ar";
					objAr.value = $("#ar").attr("value");

					var objBs = document.createElement("Input");
					objBs.type = "hidden";
					objBs.name = "bs";
					objBs.id = "bs";
					objBs.value = $("#bs").attr("value");

					var objClipKey = document.createElement("Input");
					objClipKey.type = "hidden";
					objClipKey.name = "clipkey";
					objClipKey.id = "clipkey";
					objClipKey.value = val;

					var href = $(this).attr("href");
					var kakakuKoshinOshiraseForm = $('<form action='+href+' method="post"></form>');
					kakakuKoshinOshiraseForm.appendTo("body");
					$(objTbi4dbs).appendTo(kakakuKoshinOshiraseForm);
					$(objAr).appendTo(kakakuKoshinOshiraseForm);
					$(objBs).appendTo(kakakuKoshinOshiraseForm);
					$(objClipKey).appendTo(kakakuKoshinOshiraseForm);
					kakakuKoshinOshiraseForm.attr("target", "kakakuKoshinOshiraseWindow");
					kakakuKoshinOshiraseForm[0].submit();
					return false;
				}
			}
	},

	// お気に入り削除
	deleteClipSingle : function(jscContextRoot) {
		if (SUUMO.KR_SHOSAI_COMMON.mySubmitfunc()) {
			var msg = '';
			// キー情報の取得
			var clipkey = $('#clipkey').attr('value');

			// キー情報の取得結果により表示振分
			if(clipkey != '' && clipkey != undefined) {
				$.ajax({
					type : 'GET',
					data : 'clipkey=' + clipkey,
					url : jscContextRoot + '/common/function/JJ901FL022/delete/',
					dataType : 'json',
					success : function(data){
						if (data && data.statusCode && data.statusCode === '200' && data.results) {
							if (data.results.myListBkn) {
								suumo.headerfooter.noticeCnt({
									targetID : '#js-mylistbarcnt-bukken',
									value : data.results.myListBkn.cnt
								});

								suumo.headerfooter.setCookie({
									name : 'mylist_bukken_cnt',
									value : data.results.myListBkn.cookieInfo
								});
							}
							if (data.results.myListKsh) {
								suumo.headerfooter.noticeCnt({
									targetID : '#js-mylistbarcnt-company',
									value : data.results.myListKsh.cnt
								});

								suumo.headerfooter.setCookie({
									name : 'mylist_kaisha_cnt',
									value : data.results.myListKsh.cookieInfo
								});
							}
							msg = data.msg;
							$('a.btnAddMylist').removeClass('is-inactive');
						} else {
							msg = 'お気に入り削除に失敗しました。';
						}
						showResult(msg);
						SUUMO.KR_SHOSAI_COMMON.submittedFlg = false;
					},
					timeout:10000,
					error : function(data, textStatus) {
						if (textStatus === 'timeout') {
							msg = '一定時間経過した為、お気に入り削除処理を終了しました。';
						} else {
							msg = 'お気に入り削除に失敗しました。';
						}
						showResult(msg);
						SUUMO.KR_SHOSAI_COMMON.submittedFlg = false;
					}
				});
			} else {
				msg = '削除が行えませんでした。';
				showResult(msg);
				SUUMO.KR_SHOSAI_COMMON.submittedFlg = false;
			}
		}
	}
};
