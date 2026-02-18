//thickbox挙動修正パッチ
$(function(){
	//thickboxクラスのクリック挙動を追加
	$('a.thickbox, area.thickbox, input.thickbox').click(
		function(){
			//閉じるメッセージをappend
			var bgMsg = {
				enable: true,
				html: '閉じるボタン、もしくはグレー背景をクリックすると元の画面に戻ります。',
				wrapper: 'p',
				wrapperAttr:  {'class':'js_message'}
			};
			//幅を正す
			var ajustWidth = {
				enable: false
			};
			//absolute配置
			var absPos = {
				enable: false,
				topMargin: 25
			};
			//閉じるメッセージをappend
			if( bgMsg.enable )
			{
				$('<' + bgMsg.wrapper + '>')
					.attr(bgMsg.wrapperAttr)
					.html(bgMsg.html)
					.click(function(){ tb_remove();})
					.appendTo("#TB_window")
				;
			}
			//幅を正す
			if( ajustWidth.enable )
			{
				$("#TB_window").width($("#TB_ajaxContent").width());
			}
			//absolute配置
			//NOTE: #TB_windowはウィンドウの中央配置にfixがデフォルト
			if ( absPos.enable )
			{
				//TB_windowの中央絶対座標
				var posTop = $("#TB_window").position().top;
				//TB_windowをabsoluteにし、topを絶対座標を設定
				$("#TB_window")
					.css('position', 'absolute')
					.css('top', posTop + 'px')
				;
				//TB_windowの上端がウィンドウから上にはみ出ている場合は補正
				if($("#TB_window").offset().top < absPos.topMargin)
				{
					$("#TB_window").css('top', posTop + Math.abs($("#TB_window").offset().top) + absPos.topMargin + 'px');
				}
			}
			return false;
		}
	);
});
