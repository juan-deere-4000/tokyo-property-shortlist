/***********************************************************************
 * イベント自動バインド系
 ***********************************************************************/
$(function() {
	/*
	 * テキストボックスの内容をトグルさせる
	 * 
	 */
	$(".sa-toggle").each(function() {
		$(this).data("defaultValue", this.value);
	}).focus(function() {
		var $this = $(this),
			preInput = $this.attr("preInput");
		($this.data("defaultValue") === this.value) && (this.value = preInput ? preInput : this.value = "");
	}).blur(function() {
		("" === this.value) && (this.value = $(this).data("defaultValue"));
	});

	/*
	 * イベント追加はこの下にしていく。（delegateする場合も）
	 */
});