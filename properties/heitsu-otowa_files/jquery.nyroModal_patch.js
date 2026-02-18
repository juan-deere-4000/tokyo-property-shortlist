$(function(){
	winHeight = $(window).height();
	maxH = winHeight - 190;
	$(".jsiKrThickbox").css("height", winHeight+"px");
	$(".jsiKrThickbox img").css("max-height", maxH+"px");

	$(".jsiKrMadoriThickbox").css("height", winHeight+"px");
	$(".jsiKrMadoriThickbox img").css("max-height", maxH+"px");

	$.nyroModalSettings({
		closeButton: '',
		padding: 40,
		endFillContent:function(modal, settings) {
			var gazoLoopFlg = $('#jsiGazoLoop').val();
			if (gazoLoopFlg && settings.from.id != "kma"
					&& settings.from.id != "sosin1"
					&& settings.from.id != "sosin2") {
				var gallery = $('a.jscNyroModal');
				var relKbn = settings.from.rel.substring(settings.from.rel.length-3, settings.from.rel.length);
				if (relKbn == 'CAP') {
					var currentIndex = 0;
					var currentId = settings.from.id.replace("jsiNyroModalId_#", "");
					for (i=0; i<gallery.length; i++) {
						var galleryID = gallery[i].id.replace("jsiNyroModalId_#", "");
						if (galleryID == currentId){
							currentIndex = i;
							break;
						}
					}
				} else {
					var currentIndex = gallery.index(settings.from);
					var currentId = gallery[currentIndex].id.replace("jsiNyroModalId_#", "");
				}
				$('#gazoCur_'+currentId).html(currentIndex+1);
	 			$('#gazoTotal_'+currentId).html(gallery.length);
				if (gallery.length == 1) {
					$("#nyroModalContent .btn_previous a").css("visibility", "hidden");
					$("#nyroModalContent .btn_next a").css("visibility", "hidden");
				} else {
					if(currentIndex - 1 < 0) {
						$("#nyroModalContent .btn_previous a").css("visibility", "visible").click(function(e) {
							var id = gallery[gallery.length - 1].id;
							var nyuroModalId = id.replace("jsiNyroModalId_", "");
							$(id).attr("href", nyuroModalId);
							gallery[gallery.length - 1].href = nyuroModalId;

							e.preventDefault();
							var index = gallery.length - 1;
							gallery.eq(index).nyroModalManual();
							$('#gazoCur_'+id.replace("jsiNyroModalId_#", "")).html(gallery.length);
							return false;
						});
					} else {
						$("#nyroModalContent .btn_previous a").css("visibility", "visible").click(function(e) {
							var id = gallery[currentIndex - 1].id;
							var nyuroModalId = id.replace("jsiNyroModalId_", "");
							$(id).attr("href", nyuroModalId);
							gallery[currentIndex - 1].href = nyuroModalId;

							e.preventDefault();
							var index = currentIndex - 1;
							if (index >= 0 && index < gallery.length) {
								gallery.eq(index).nyroModalManual();
							}
							$('#gazoCur_'+id.replace("jsiNyroModalId_#", "")).html(currentIndex);
							return false;
						});
					}
					if(currentIndex + 1 >= gallery.length) {
						$("#nyroModalContent .btn_next a").css("visibility", "visible").click(function(e) {
							var id = gallery[0].id;
							var nyuroModalId = id.replace("jsiNyroModalId_", "");
							$(id).attr("href", nyuroModalId);
							gallery[0].href = nyuroModalId;

							e.preventDefault();
							var index = "0";
								gallery.eq(index).nyroModalManual();
							$('#gazoCur_'+id.replace("jsiNyroModalId_#", "")).html(1);
							return false;
						});
					} else {
						$("#nyroModalContent .btn_next a").css("visibility", "visible").click(function(e) {
							var id = gallery[currentIndex + 1].id;
							var nyuroModalId = id.replace("jsiNyroModalId_", "");
							$(id).attr("href", nyuroModalId);
							gallery[currentIndex + 1].href = nyuroModalId;

							e.preventDefault();
							var index = currentIndex + 1;
							if (index >= 0 && index < gallery.length) {
								gallery.eq(index).nyroModalManual();
							}
							$('#gazoCur_'+id.replace("jsiNyroModalId_#", "")).html(currentIndex+2);
							return false;
						});
					}
				}
			} else {
			var gallery = $('[rel="'+ settings.from.rel +'"]');
			var currentIndex = gallery.index(settings.from);
			if(currentIndex - 1 < 0) {
				$("#nyroModalContent .btn_previous a").css("visibility", "hidden");
			} else {
				$("#nyroModalContent .btn_previous a").css("visibility", "visible").click(function(e) {
					//add
					var id = gallery[currentIndex - 1].id;
					var nyuroModalId = id.replace("jsiNyroModalId_", "");
					$(id).attr("href", nyuroModalId);
					gallery[currentIndex - 1].href = nyuroModalId;

					e.preventDefault();
					var index = currentIndex - 1;
					if (index >= 0 && index < gallery.length) {
						gallery.eq(index).nyroModalManual();
					}
					return false;
				});
			}
			if(currentIndex + 1 >= gallery.length) {
				$("#nyroModalContent .btn_next a").css("visibility", "hidden");
			} else {
				$("#nyroModalContent .btn_next a").css("visibility", "visible").click(function(e) {
					//add
					var id = gallery[currentIndex + 1].id;
					var nyuroModalId = id.replace("jsiNyroModalId_", "");
					$(id).attr("href", nyuroModalId);
					gallery[currentIndex + 1].href = nyuroModalId;

					e.preventDefault();
					var index = currentIndex + 1;
					if (index >= 0 && index < gallery.length) {
						gallery.eq(index).nyroModalManual();
					}
					return false;
				});
			}
		}
			$("#nyroModalContent").after("<p class='js_message nyroModalClose'>閉じるボタン、もしくはグレー背景をクリックすると一覧画面に戻ります。</p>");
			var index = currentIndex + 1;
			index = (index < 10)? "0" + index : index;
			var modal_num = gallery.size();
			modal_num = (modal_num < 10)? "0" + modal_num : modal_num;
			$("#nyroModalContent .modal_index").text("[ " + index + " / " + modal_num + " ]");

			$("#nyroModalContent").find("img").each(function(){
			    var imgOrgn = $("#" + $(this).attr('id') + "orgn" );
			    if( imgOrgn.length > 0 ){
			        var data = imgOrgn.val().split(",");
			        $(this).attr('src', data[0]);
			        var altData = data[1];
			        for (i=2;i<data.length;i++){ // altに","が入っていた場合の対応
			            altData = altData + "," + data[i];
			        }
			        $(this).attr('alt', altData);
			    }
			});
		},
		showBackground: function(elts, settings, callback) {
			elts.bg.css({opacity:0}).fadeTo(500, 0.75, callback);
			IE6fix();
		}
	});
	function IE6fix() {
		if ($.browser.msie && $.browser.version.split('.')[0] < 7) {
			$("body").css({
				width: 'auto'
			});
			$('html').css({overflow: 'hidden'});
			$("#nyroModalBg, #nyroModalIframeHideIe").css({
				position: 'absolute',
				top: '0px',
				left:'0px',
				width: '100%',
				height: '100%'
			});
		}
	}
});
