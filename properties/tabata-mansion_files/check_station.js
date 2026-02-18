/*
 * check_station.js
 *
 * 駅名チェック
 * 
 * テキスト入力フォームに対して、駅名のAjaxチェック処理（イベントトリガ="check_station"）を組み込む
 * 
 * <input type="text" class="js_check_station" />に対して、デフォルト設定を自動で適用
 * ($.fn.checkStation.defaults.*のデフォルト設定を上書きすることで変更可能）
 *
 * <input type="text" class="js_check_station" />を駅名の入力フォーム
 * <div></div>に結果表示（inputの次のエレメント）
 *
 * 結果表示
 *   <div>
 *     <p>メッセージ</p>
 *     <ul>
 *       <li>駅名</li>
 *       <li>駅名</li>
 *       <li>駅名</li>
 *         :
 *     </ul>
 *   </div>
 *
 * Ajaxの戻り値
 *  1行目: 完全一致の有無 1|0
 *  2行目: 表示メッセージ（複数候補の存在、エラー内容など）
 *  3行目以降: 1行1レコード駅名文字列
 *  
 * @require jquery.js
 *
 * @param {key1: value1, key2: value2} (optional)
 *        url: リクエストするURL
 *        dataType: Ajax受け取るデータタイプ
 *        extraParams: 追加パラメータ
 *        resultPlacement: 結果表示位置 jQueryもしくはfunction (inputElm){}
 *        buildParams: 送信パラメータ取得 function (inputElm){}
 *        parseResult: 結果パース function (data){}
 *        onBeforeSend: Ajax送信前処理 function (inputElm, resultElm){}
 *        onSuccess: Ajax成功時処理 function (inputElm, resultElm, result){}
 *        onError: Ajaxエラー時処理 function (inputElm, resultElm){}
 *        onComplete: Ajax終了処理 function (inputElm, resultElm){}
 *        showResult: 結果表示処理 function (inputElm, resultElm, result){}
 *
 * @example <input type="text" class="js_check_station"/>
 * @example $(".my_check_station").checkStation({url:"/path/to/ajax"});
 */
(function($){

	//駅名チェック
	$.fn.checkStation = function(options){

		//オプション拡張
		options = $.extend({}, $.fn.checkStation.defaults, options);

		//入力フォーム
		var inputElm = this.filter("input:text");
		
		//結果表示エリア
		var resultElm = ($.isFunction(options.resultPlacement))? options.resultPlacement(inputElm): $(options.resultPlacement);

		//オリジナルのbind
		inputElm.bind("check_station", check);

		//チェック
		function check(){
			//Ajax設定
			var ajaxOptions = {
				//前のリクエストを中止
				mode: "abort", 
				//ajaxリクエスト識別子
				port: "check_station_" + inputElm.attr('name'),
				//データタイプ
				dataType: options.dataType, 
				//データ取得URL
				url: options.url, 
				//リクエストパラメータ
				data: $.extend(options.buildParams(inputElm), buildExtraParams()), 
				//送信前
				beforeSend: function (xhr) { 
					if($.isFunction(options.onBeforeSend))
					{
						return options.onBeforeSend(inputElm, resultElm);
					}
					return true;
				},
				//成功時
				success: function(data, textStatus) { 
					var result = options.parseResult(data);
					//結果取得時処理
					if($.isFunction(options.onSuccess))
					{
						options.onSuccess(inputElm, resultElm, result);
					}
					//結果表示処理
					if($.isFunction(options.showResult))
					{
						options.showResult(inputElm, resultElm, result);
					}
				},
				//エラー時
				error: function (xhr, textStatus, errorThrown) { 
					if($.isFunction(options.onError))
					{
						options.onError(inputElm, resultElm);
					}
				},
				//終了時
				complete: function (xhr, textStatus) { 
					if($.isFunction(options.onComplete))
					{
						options.onComplete(inputElm, resultElm);
					}
				}
			};

			//ajaxリクエスト送信
			$.ajax(ajaxOptions);
		}

		//追加パラメータの作成
		function buildExtraParams(){
			//追加パラメータ
			var extraParams = {
				timestamp: +new Date()
			};
			$.each(options.extraParams, function(key, param) {
				extraParams[key] = typeof param == "function" ? param() : param;
			});
			return extraParams;
		}

	};

	/**************************************************
	 * デフォルト設定
	 **************************************************/
	$.fn.checkStation.defaults = $.extend(
		{
			//リクエストURL
			url: "ajax_check_station.php", 
			
			//レスポンスの結果データタイプ
			dataType: "text", 

			//追加パラメータ
			extraParams: {} 
		},
		{
			/**************************************************
			 * 結果表示エレメント取得
			 * @param inputElm input element
			 * @return jQuery result display element
			 **************************************************/
			resultPlacement: function (inputElm){
				return inputElm.next();
			},

			/**************************************************
			 * クエリパラメータの作成
			 * @param inputElm input element
			 * @param resultElm result element
			 * @return object of query paramater
			 **************************************************/
			buildParams: function (inputElm){
				return { "q": inputElm.val() };
			}, 

			/**************************************************
			 * 駅名チェック結果のパース
			 * @param data data of $.ajax.success()
			 * @return parsed results ({isCompleteMatch:true|false, message:string, items:[results items]})
			 **************************************************/
			parseResult: function (data){
				var results = {
					isCompleteMatch: false,
					message: '',
					items: []
				};
				
				var rows = data.split("\n");
							
				// 結果が2行以下であれば終了（不正）
				if(rows.length < 2)
				{
					return results;
				}
		
				// 完全一致行の有無フラグ（1行目）
				results.isCompleteMatch = (rows.shift() == 1);
		
				// メッセージ文言（2行目）
				results.message = rows.shift();
		
				// 候補（3行目以降）
				for (var i=0; i < rows.length; i++)
				{
					var row = $.trim(rows[i]);
					if (row) {
						results.items.push(row);
					}
				}
		
				return results;
			}, 

			/**************************************************
			 * Ajaxリクエスト送信前処理
			 * @param inputElm input element
			 * @param resultElm result element
			 * @return true or false (send or not send)
			 **************************************************/
			onBeforeSend: function (inputElm, resultElm){
			},
			
			/**************************************************
			 * Ajax成功時処理
			 * @param inputElm input element
			 * @param resultElm result element
			 * @param result result object
			 **************************************************/
			onSuccess: function (inputElm, resultElm, result){
			},
			
			/**************************************************
			 * Ajaxエラー時処理
			 * @param inputElm input element
			 * @param resultElm result element
			 **************************************************/
			onError: function (inputElm, resultElm){
				//最初にクリア
				resultElm.html("");

				var message = "エラーが発生しました";
				
				//メッセージを追加
				$("<p/>")
					.html(message)
					.appendTo(resultElm)
				;
				
				//チェック結果表示
				resultElm.show();
				//テキストフォームにfocusさせてスクロール
				inputElm.focus();
			},
			
			/**************************************************
			 * Ajax終了時処理
			 * @param inputElm input element
			 * @param resultElm result element
			 **************************************************/
			onComplete: function (inputElm, resultElm){
			},
			
			/**************************************************
			 * 結果表示処理
			 * @param inputElm input element
			 * @param resultElm result element
			 * @param result result object
			 **************************************************/
			showResult: function (inputElm, resultElm, result){
				//最初にクリア
				resultElm.html("");
				
				//メッセージを追加
				if(result.message)
				{
					$("<p/>")
						.html(result.message)
						.appendTo(resultElm)
				}
				// 結果を追加
				if(result.items.length > 0)
				{
					var listElm = $("<ul/>").appendTo(resultElm);
					for (var i=0; i < result.items.length; i++)
					{
						$("<li/>")
							.html(result.items[i])
							.click( function(){
								inputElm.val($(this).text());
								return false;
							})
							.appendTo(listElm)
						;
					}
				}
				//チェック結果表示
				resultElm.show();
				//テキストフォームにfocusさせてスクロール
				inputElm.focus();
			}
		}
	);

	//自動設定
	$(function(){
		$("input:text.js_check_station").checkStation();
	});

})(jQuery);

