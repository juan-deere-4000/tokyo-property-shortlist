/*
 * check_railroad.js
 *
 * 沿線検索用駅名チェック
 * 
 * 沿線検索用の駅名テキスト入力フォームに対して、沿線検索用のAjaxチェック処理を実行
 * 駅名の完全一致、候補のクリック時には、沿線表示 showRailroad(駅名文字列) を実行
 * 
 * <input type="text" class="js_check_railroad_input" />を駅名の入力フォーム
 * <div class="js_check_railroad_result"></div>に結果表示
 * <input type="submit|button" class="js_check_railroad_trigger">のclickで作動（aタグなどでも可）
 *
 * 結果表示
 *   <div class="js_check_railroad_result">
 *     <p>メッセージ</p>
 *     <ul class="clr first_top">
 *       <li><a>駅名</a></li>
 *       <li><a>駅名</a></li>
 *       <li><a>駅名</a></li>
 *     </ul>
 *     <ul class="clr">
 *       <li><a>駅名</a></li>
 *       <li><a>駅名</a></li>
 *       <li><a>駅名</a></li>
 *     </ul>
 *      :
 *   </div>
 *
 * @require jquery.js
 * @require jquery.ajaxQueue.js
 * @require check_station.js
 *
 * @see check_station.js
 */
(function($){
$(function(){
	//入力フォーム
	var inputElm = $("input:text.js_check_railroad_input");
	//結果表示エリア
	var resultElm = $(".js_check_railroad_result");
	//ボタン
	var triggerElm = $(".js_check_railroad_trigger");

	//入力フォームに駅名チェック設定
	inputElm.checkStation({
		//結果の書き出し先
		resultPlacement: resultElm,
		//成功時
		onSuccess: function(inputElm, resultElm, result){
			//完全一致であれば
			if(result.isCompleteMatch){
				//沿線表示処理
				showRailroad(inputElm.val());
			}
			//デフォルトの処理
			$.fn.checkStation.defaults.onSuccess(inputElm, resultElm, result);
		},
		//結果表示
		showResult: function(inputElm, resultElm, result){
			//完全一致であれば何もせずに終了
			if(result.isCompleteMatch){
				return;
			}
			//結果をクリア
			resultElm.html("");
			
			//メッセージを追加（<p>）
			if(result.message)
			{
				$("<p/>")
					.html(result.message)
					.appendTo(resultElm)
			}
			// 結果を追加（<ul><li><a>...</a></li>...</ul>）
			if(result.items.length > 0)
			{
				var listElm;
				for (var i=0; i < result.items.length; i++)
				{
					//3アイテムごとにulを追加
					if(i%3 == 0)
					{
						listElm = $("<ul/>").addClass("clr").appendTo(resultElm);
					}
					//最初のみfirst_topクラスを追加
					if(i == 0)
					{
						listElm.addClass("first_top");
					}
					$("<li/>")
						.html(result.items[i])
						.wrapInner(
							$("<a />").attr("href", "javascript:void(0);")
						)
						.appendTo(listElm)
					;
				}
				//駅名候補のクリック時の動作設定
				resultElm.find("ul li a").click(function(){
					inputElm.val($(this).text());
					showRailroad(inputElm.val());
					return false;
				});
			}
			//チェック結果表示
			resultElm.show();
			//テキストフォームにfocus、blurでスクロールさせる
			inputElm.focus();
			inputElm.blur();
		}
	});

	//トリガのクリック処理
	triggerElm.click(function(){
		//駅名チェックを作動
		inputElm.triggerHandler("check_station");
		return false;
	});

	//検索結果の確定時の沿線表示処理
	function showRailroad(station){
		alert("沿線表示\n" + "駅名:" + station);
	}

});
})(jQuery);

