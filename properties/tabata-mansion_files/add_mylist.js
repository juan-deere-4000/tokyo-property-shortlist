/*
 * add_mylist.js
 *
 * マイリストに追加処理
 * 
 * マイリストに追加ボタン押下時に、Ajaxを用いて物件情報を送信
 * 追加結果を受け取り、結果表示
 * 
 * <a class="js_add_mylist">追加</a>
 * <div>メッセージ結果</div>（トリガとなるエレメントのnext()）
 *
 * Ajaxの送信パラメータ（仮）
 *  q=トリガ.text()
 *  
 * Ajaxの戻り値（仮）
 *  1行目：メッセージ
 *  2行目以降：アイテム
 *  
 * @require jquery.js
 * @require jquery.ajaxQueue.js
 *
 * @param {key1: value1, key2: value2} (optional)
 *        url: リクエストするURL
 *        dataType: Ajax受け取るデータタイプ
 *        extraParams: 追加パラメータ
 *        resultPlacement: 結果表示位置 jQueryもしくはfunction (triggerElm){}
 *        buildParams: 送信パラメータ取得 function (triggerElm){}
 *        parseResult: 結果パース function (data){}
 *        onBeforeSend: Ajax送信前処理 function (triggerElm, resultElm){}
 *        onSuccess: Ajax成功時処理 function (triggerElm, resultElm, result){}
 *        onError: Ajaxエラー時処理 function (triggerElm, resultElm){}
 *        onComplete: Ajax終了処理 function (triggerElm, resultElm){}
 *        showResult: 結果表示処理 function (triggerElm, resultElm, result){}
 *
 * @example <a class="js_add_mylist">追加</a><div></div>
 * @example $(".my_add_mylist").addMylist({url:"/path/to/ajax"});
 */
(function($){

	//マイリスト追加
	$.fn.addMylist = function(options){

		//オプション拡張
		options = $.extend({}, $.fn.addMylist.defaults, options);

		return this.each(function(index){
			//入力フォーム
			var triggerElm = $(this);
			
			//結果表示エリア
			var resultElm = ($.isFunction(options.resultPlacement))? options.resultPlacement(triggerElm): $(options.resultPlacement);

			//トリガにclickをbind
			triggerElm.bind("click.add_mylist", add);

			//送信
			function add(){
				//Ajax設定
				var ajaxOptions = {
					//前のリクエストを中止
					mode: "abort", 
					//ajaxリクエスト識別子
					port: "add_my_list",
					//データタイプ
					dataType: options.dataType, 
					//データ取得URL
					url: options.url, 
					//リクエストパラメータ
					data: $.extend(options.buildParams(triggerElm), buildExtraParams()), 
					//送信前
					beforeSend: function (xhr) { 
						if($.isFunction(options.onBeforeSend))
						{
							return options.onBeforeSend(triggerElm, resultElm);
						}
						return true;
					},
					//成功時
					success: function(data, textStatus) { 
						var result = options.parseResult(data);
						//結果取得時処理
						if($.isFunction(options.onSuccess))
						{
							options.onSuccess(triggerElm, resultElm, result);
						}
						//結果表示処理
						if($.isFunction(options.showResult))
						{
							options.showResult(triggerElm, resultElm, result);
						}
					},
					//エラー時
					error: function (xhr, textStatus, errorThrown) { 
						if($.isFunction(options.onError))
						{
							options.onError(triggerElm, resultElm);
						}
					},
					//終了時
					complete: function (xhr, textStatus) { 
						if($.isFunction(options.onComplete))
						{
							options.onComplete(triggerElm, resultElm);
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
		});
	}

	/**************************************************
	 * デフォルト設定
	 **************************************************/
	$.fn.addMylist.defaults = $.extend(
		{
			//リクエストURL
			url: "ajax_add_mylist.php", 
			
			//レスポンスの結果データタイプ
			dataType: "text", 

			//追加パラメータ
			extraParams: {} 
		},
		{
			/**************************************************
			 * 結果表示エレメント取得
			 * @param triggerElm input element
			 * @return jQuery result display element
			 **************************************************/
			resultPlacement: function (triggerElm){
				return triggerElm.next();
			},

			/**************************************************
			 * クエリパラメータの作成
			 * @param triggerElm input element
			 * @param resultElm result element
			 * @return object of query paramater
			 **************************************************/
			buildParams: function (triggerElm){
				return { "q": triggerElm.text() };
			}, 

			/**************************************************
			 * 結果のパース
			 * @param data data of $.ajax.success()
			 * @return parsed results ({message:string, items:[results items]})
			 **************************************************/
			parseResult: function (data){
				var results = {
					message: ''
				};
				
				var rows = data.split("\n");
							
				// メッセージ文言（1行目）
				results.message = rows.shift();
				//アイテム（2行目以降）
				results.items = rows;
				
				return results;
			}, 

			/**************************************************
			 * Ajaxリクエスト送信前処理
			 * @param triggerElm input element
			 * @param resultElm result element
			 * @return true or false (send or not send)
			 **************************************************/
			onBeforeSend: function (triggerElm, resultElm){
			},
			
			/**************************************************
			 * Ajax成功時処理
			 * @param triggerElm input element
			 * @param resultElm result element
			 * @param result result object
			 **************************************************/
			onSuccess: function (triggerElm, resultElm, result){
			},
			
			/**************************************************
			 * Ajaxエラー時処理
			 * @param triggerElm input element
			 * @param resultElm result element
			 **************************************************/
			onError: function (triggerElm, resultElm){
				//最初にクリア
				resultElm.html("");

				var message = "エラーが発生しました";
				
				//メッセージを追加
				$("<p/>")
					.html(message)
					.appendTo(resultElm)
				;
				
				//結果表示
				resultElm.show();
			},
			
			/**************************************************
			 * Ajax終了時処理
			 * @param triggerElm input element
			 * @param resultElm result element
			 **************************************************/
			onComplete: function (triggerElm, resultElm){
			},
			
			/**************************************************
			 * 結果表示処理
			 * @param triggerElm input element
			 * @param resultElm result element
			 * @param result result object
			 **************************************************/
			showResult: function (triggerElm, resultElm, result){
				//最初にクリア
				resultElm.html("");
				
				//メッセージを追加
				if(result.message)
				{
					$("<p/>")
						.html(result.message)
						.appendTo(resultElm)
				}
				//結果表示
				resultElm.show();
			}
		}
	);
	
	//自動設定
	$(function(){
		$(".js_add_mylist").addMylist();
	});

})(jQuery);

