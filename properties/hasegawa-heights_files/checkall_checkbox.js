/**
 * checkall_checkbox.js
 *
 * 他のチェックボックス群をまとめてチェック、チェック解除するプラグイン
 *
 * トリガとなるチェックボックスをチェックすると、対象のチェックボックスが全てチェックされる
 * トリガとなるチェックボックスをチェックを外すと、対象のチェックボックスのチェックがすべて外れる
 * 対象のチェックボックスのチェックが1つでも外れた場合、トリガとなるチェックボックスのチェックが外れる
 *
 * @require jquery.js
 *
 * @param {String, DOMElement, jQuery} target 対象のチェックボックス
 *
 * @example $(".checkall input:checkbox").checkAllCheckbox('.data_table input:checkbox')
 */

(function($) {
    $.fn.checkAllCheckbox = function(target, options) {

        //オプション拡張
        options = $.extend( {}, $.fn.checkAllCheckbox.defaults, options );
		// 2009.03.09 start zhaoaiqing modifty
        //トリガとなるチェックボックス
        //var triggerElm = this.filter(":checkbox");
        var triggerElm = this.filter(":checkbox:enabled");
        //対象となるチェックボックス
       // var targetElm = $(target).filter(":checkbox");
        var targetElm = $(target).filter(":checkbox:enabled");
        // 2009.03.09 end 
		
        //トリガが存在しなければ終了
        if(triggerElm.size() < 1)
        {
            return this;
        }

        //トリガとなるチェックボックスの変更時
        triggerElm.click(function(){
            //チェックされたら
            if($(this).attr("checked"))
            {
                //対象にチェック
                triggerElm.attr("checked", true);
                //他のトリガもチェック
                targetElm.attr("checked", true);
            }
            //チェックが外れたら
            else
            {
                //チェックをはずす
                targetElm.attr("checked", false);
                //他のトリガもチェックをはずす
                triggerElm.attr("checked", false);
            }
        });
        //対象となるチェックボックスの変更時
        targetElm.click( function(){
            //チェックが外れたら
            if(!$(this).attr("checked"))
            {
                //トリガのチェックをはずす
                triggerElm.attr("checked", false);
            }
        });
        return this;
    }
    
    //デフォルトオプション
    $.fn.checkAllCheckbox.defaults = {
    };

})(jQuery);
