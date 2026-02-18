//header検索例
$(function(){
	$("input#kns01").css("color","#CCCCCC");
	$("#kns01").focus(function(){
          if(this.value == "住所・駅名・マンション名などを入力"){
               $(this).val("").css("color","#000000");
          }
     });
	$("#kns01").blur(function(){
          if(this.value == ""){
               $(this).val("住所・駅名・マンション名などを入力").css("color","#CCCCCC");
          }         
     });
});

$(function(){
	$("input#knstop").css("color","#CCCCCC");
	$("#keywordbox").css("display", "none");
	$("#knstop").focus(function(){
          if(this.value == "キーワード"){
               $(this).val("").css("color","#000000");
          }     
     });
	$("#knstop").blur(function(){
          if(this.value == ""){
               $(this).val("キーワード").css("color","#CCCCCC");
          }        
     });
});
