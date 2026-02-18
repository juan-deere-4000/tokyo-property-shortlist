/*
 * autocomplete_station.js
 *
 * 駅名サジェスト
 * 
 * テキスト入力フォームに対して、駅名のAjaxサジェスト処理を実行
 * autocompleteプラグインを拡張（firefoxのIME利用時の定期チェック、URLのデフォルト値など）
 * <input type="text" class="autocomplete_station" />に対して、デフォルト設定を自動で適用
 * ($.fn.autocompleteStation.defaults.*のデフォルト設定を上書きすることで変更可能）
 *
 * Ajaxの戻り値
 *  1行1レコードの駅名文字列
 *
 * @require jquery.js
 * @require jquery.autocomplete.js
 * @require jquery.ajaxQueue.js
 * @require jquery.bgiframe.js
 * @require jquery.autocomplete.css
 *
 * @param {key1: value1, key2: value2} (optional)
 *        url: リクエストするURL
 *        loopCheckInterval: フォーカス時に入力チェックを定期的に行う間隔（msec）。0であれば定期チェックを行わない。
 *        その他: jquery.autocompleteのオプションと同様
 *
 * @see jquery.autocomplete http://bassistance.de/jquery-plugins/jquery-plugin-autocomplete/
 *
 * @example <input type="text" class="js_autocomplete_station" />
 * @example $(".my_autocomplete_station").autocompleteStation({url:"/path/to/ajax"});
 */

(function($){

	$.fn.autocompleteStation = function(options){

		options = $.extend({}, $.fn.autocompleteStation.defaults, options);

		var url = options.url;
		delete options.url;

		var loopCheckInterval = options.loopCheckInterval;
		delete options.loopCheckInterval

		return this
			.filter("input:text")
			.autocomplete( //autocomplete
				url, //データ取得URL
				options
			) // end of autocomplete
			.each(function() {
				//ループチェック（IME on Firefox）

				var inputElm = $(this);
				//インターバルが設定されていなれば終了
				if(!loopCheckInterval)
				{
					return;
				}
				var timeoutId = null;
				//チェック開始
				function startLoopCheck() {
					stopLoopCheck();
					//キー操作をエミュレイトし、autocomplete作動
					inputElm.triggerHandler(($.browser.opera ? "keypress" : "keydown") + ".autocomplete");
					timeoutId = setTimeout(startLoopCheck, loopCheckInterval);
				}
				//チェック停止
				function stopLoopCheck() {
					clearTimeout(timeoutId);
				}
				//フォーカス、ブラーにバインド
				inputElm
					.bind('focus.autocomplete_loopcheck', startLoopCheck)
					.bind('blur.autocomplete_loopcheck', stopLoopCheck)
				;
			})
		;
	};

	//デフォルト設定
	$.fn.autocompleteStation.defaults = $.extend(

		//独自オプション
		{
			url: 'ajax_autocomplete_station.php', //URL
			loopCheckInterval: 1000 //ループチェックのインターバル
		},
		
		//jquery.autocomplete.jsのオプション
		{
			max: 50, //候補数
			//width: 200, //幅
			//scroll: true, //スクロールの有無
			//scrollHeight: 200, //スクロールの高さ
			//minChars: 3, //補完開始文字数
			//delay: 400, //表示開始ディレイ
			//autoFill: false, //自動入力
			//mustMatch: true, //一致文字列のみ有効
			//matchContains: true, //部分一致
			//selectFirst: false, //最初の候補を選択
			//multiple: true, //複数選択
			//multipleSeparator: " ", //複数選択時の区切り文字
			//inputClass: "ac_input", //入力に付与するクラス
			//resultsClass: "ac_results", //結果リストに付与するクラス
			//loadingClass: "ac_loading", //ローディングに付与するクラス
			extraParams: {} //送信する追加パラメータ
			/*
			highlight: function(value, term) { //ハイライトcallback
				return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
			},
			formatItem: function(row, i, max, term) { //サジェスト候補表示フォーマットcallback
				var col = term.split("\t");
				return col[0] + " [" + col[1] + "] (" + i + "/" + max + ")";
			},
			formatMatch: function(row, i, max) { //サジェスト候補限定callback
			},
			formatResult: function(row) { //サジェスト候補入力フォーマットcallback
				return (row[0].split("\t"))[1];
			},
			parse: function(data) { //サジェスト結果パースcallback
				var parsed = [];
				var rows = data.split("\n");
				for (var i=0; i < rows.length; i++) {
					var row = $.trim(rows[i]);
					if (row) {
						row = row.split("|");
						parsed[parsed.length] = {
							data: row,
							value: row[0],
							result: options.formatResult && options.formatResult(row, row[0]) || row[0]
						};
					}
				}
				return parsed;
			},
			*/
		}
	);

	//自動設定
	$(function(){
		$("input:text.js_autocomplete_station").autocompleteStation();
	});

})(jQuery);
