$(function(){
	$("body").on("click", ".user_tab>div", function(){userSwitch(this)})
	.on("click", ".login", userLogin)
	.on("keydown", "#editArea", MessageTextOnKeyEnter)
	.on("click", ".action>a.btn_send", sendMessage)

	.on("click", ".message .picture>img", function(){imgPreview(this)})
	.on("click", "#imgPreview a#prev", imgPrev)
	.on("click", "#imgPreview a#next", imgNext)
	.on("click", "#imgPreview a#download", saveImage)
	.on("click", ".img_preview_close", function () {
			$("#imgPreview").addClass("hide");
			$("#imgContainer img").remove();
	});

})

function imgPreview(that){
	var src = $(that).data("src");
	var imgs = $(".message .picture .msg-img");
	var current = $(imgs).index($(that));
	$("#imgPreview").removeClass("hide").data({"imgs": imgs,"current": current});
	checkPos(imgs, current);
	var container = $$("imgContainer"),
	    src = src,
	    options = {
	        mode: "css3",
	        onPreLoad: function () {
	            container.style.background = "url('images/big_loading.gif') center no-repeat";
	        },
	        onLoad: function () {
	            container.style.backgroundImage = "";
	        },
	        onError: function (err) {
	            container.style.backgroundImage = "";
	            alert(err);
	        }
	    },
	    it = new ImageTrans(container, options);
	it.load(src);
	$$("toLeft").onclick = function () { it.left(); }
}

function imgPrev(){
	var imgs = $("#imgPreview").data("imgs");
	var current = $("#imgPreview").data("current");
	if( current-- > 0){
		$("#imgContainer>img").attr("src", $($(imgs)[current]).attr("src"));
		$("#imgPreview").data({"current": current});
		checkPos(imgs, current);
	}
}

function imgNext(){
	var imgs = $("#imgPreview").data("imgs");
	var current = $("#imgPreview").data("current");
	if( current++ < imgs.length - 1){
		$("#imgContainer>img").attr("src", $($(imgs)[current]).attr("src"));
		$("#imgPreview").data({"current": current});
		checkPos(imgs, current);
	}
}

function saveImage() {
	var address = $("#imgContainer>img").attr("src");
	var a = $("<a>").attr("href", address).attr("download", address).appendTo("body");
	a[0].click();
	a.remove();
}

function checkPos(imgs, current){
	current > 0 ? $("a#prev>i").removeClass("palfish_left_disable") : $("a#prev>i").addClass("palfish_left_disable");
	current < imgs.length - 1 ? $("a#next>i").removeClass("palfish_right_disable") : $("a#next>i").addClass("palfish_right_disable");
}

function userSwitch (that) {
	if($(that).hasClass("on")) return false;
	$(".user_tab>div").removeClass("on");
	$(that).addClass("on");
}

function userLogin(){
	var cellphone = $("#login_box .cellphone").val();
	var password = $("#login_box .password").val();
	console.log(cellphone+"..."+ password);
	if(cellphone&&password){
		window.location.href = "./chat.html";
	}

}

function MessageTextOnKeyEnter(e) {
    if(window.event) {
      var keyCode = window.event.keyCode;
    }
    else {
      var keyCode = e.keyCode || e.which;
    }

    if( (!e.ctrlKey && (keyCode == 13)) ) {
      sendMessage();
      return false;
    }
    else if( (e.ctrlKey && (keyCode == 13)) || (keyCode == 10) ) {
      var val = this.value;
      if (typeof this.selectionStart == "number" && typeof this.selectionEnd == "number") {
          var start = this.selectionStart;
          this.value = val.slice(0, start) + "\n" + val.slice(this.selectionEnd);
          this.selectionStart = this.selectionEnd = start + 1;
      } else if (document.selection && document.selection.createRange) {
          this.focus();
          var range = document.selection.createRange();
          range.text = "\r\n";
          range.collapse(false);
          range.select();
      }
    }                  
  }

function sendMessage(){
	var msg = $("#editArea").val();
	if(!msg) return false;
	var html = ''+ 
		'<div class="chatItem">' +
	      '<div class="clearfix">' +
	          '<div style="overflow: hidden;">' +
	              '<div class="message me">' +
	                  // '<p class="message_system"><span class="content">'+Date.now()+'</span></p>' +
	                  '<img class="avatar" src="images/132.jpg" title="real__隔壁老顾">' +
	                  '<div class="content">' +
	                      '<div class="bubble js_message_bubble bubble_primary right">' +
	                          '<div class="bubble_cont">' +
	                              '<div class="plain">' +
	                                  '<pre class="js_message_plain">'+msg+'</pre>' +
	                                  '<img class="ico_loading hide" src="images/ico_loading.gif" alt="">' +
	                                  '<i class="ico_fail palfish_message_fail hide" title="重新发送"></i>' +
	                              '</div>' +
	                          '</div>' +
	                      '</div>' +
	                  '</div>' +
	              '</div>' +
	          '</div>' +
	      '</div>' +
	  '</div>';
	  $(".bottom-placeholder").before(html);
	  $("#editArea").val("");
	  // var height = $('.box_bd.scroll-content>div').first().outerHeight();
	  // $('.box_bd.scroll-content').slimScroll({start: 'bottom'});
}

