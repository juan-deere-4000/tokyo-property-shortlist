/**
 * 親子のチェックボックスコンボ
 *
 * 親をチェックした場合
 *   子のラッパに特定のクラス名を追加
 *   子のラッパ配下のcheckboxのチェック解除
 * 親をチェックを外した場合
 *   子のラッパの特定のクラス名を削除
 * 子をチェックした場合
 *   親のチェック解除（親のチェックを外した処理を実行）
 */
(function($){
	//親と子のチェックボックスコンボ
	$.fn.checkboxCombo = function(options){

		//親チェックボックス
		var $parents = $(this);

		options = $.extend({}, $.fn.checkboxCombo.defaults, options);

		//親を走査
		return $parents.each(
			function(index){
				var $parent = $(this);
				//親のクリックイベント設定
				$parent.bind("click.parentUpdate", function(evnt){
					onParentUpdate($parent);
				});
				//最初に親のチェック状態で表示更新
				onParentUpdate($parent);
			}
		);

		//親が更新された際の子の変更処理
		function onParentUpdate($parents){
			$parents.each(function(index){
				var $parent = $(this);
				var isChecked = $parent.filter(":checked").size();
				//子のラッパ取得
				var $childWrapper;
				if($.isFunction(options.childWrapper)){
					$childWrapper = options.childWrapper.apply(this, [$parent]);
				}
				else if($(options.childWrapper).size()){
					$childWrapper = $(options.childWrapper);
				}
				else {
					return null;
				}
				//子チェックボックス取得
				var $childs = $childWrapper.find("input:checkbox");
				//親がチェックされていれば
				if(isChecked){
					//子のチェック解除
					$childs.removeAttr("checked");
					//子のクリックイベント設定
					$childs.bind("click.childUpdate", function(evnt){
						onChildUpdate($childs, $parent);
					});
					//子のラッパにDisableクラス追加
					$childWrapper.addClass(options.childWrapperDisableClass);
				}
				else{
					//子のクリックイベント解除
					$childs.unbind("click.childUpdate");
					//子のラッパからDisableクラス削除
					$childWrapper.removeClass(options.childWrapperDisableClass);
				}
			});
		}
	
		//子が更新された際の親の変更処理
		function onChildUpdate($childs, $parent){
			var isChecked = $childs.filter(":checked").size();
			//子がチェックされていれば
			if(isChecked){
				//親のチェック解除
				$parent.removeAttr("checked");
				//親の更新処理を実行
				$parent.triggerHandler("click.parentUpdate");
			}
		}
	}

	$.fn.checkboxCombo.defaults = {
		//子チェックボックスのラッパの取得関数（引数：親のチェックボックス）、またはセレクタ
		childWrapper: function($parent){
			return $parent.next();
		},
		//子チェックボックスのDisable表示クラス
		childWrapperDisableClass: "js_checkbox_combo_disable"
	};

	/*
	$(function(){
		var $parents = $(".js_checkbox_combo").checkboxCombo();
	});
	*/

})(jQuery);
