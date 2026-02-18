/***********************************************************************
 * Suumo Archiveの名前空間
 ***********************************************************************/
var sa = sa || {};

/***********************************************************************
 * UI,ユーザビリティ系
 ***********************************************************************/
sa.input = {};
/**
 * chekboxの全選択／個別選択をトグルさせる。
 */
sa.input.checkIndiv = function() {
	var selector = $(this).attr("target"),
	inputs = $("." + selector),
	max = inputs.length,
	num = inputs.filter(":checked").length;
	
	$("#" + selector).prop("checked", max === num);
};
sa.input.checkAll = function() {
	$("." + $(this).attr("id")).prop("checked", this.checked);
};
