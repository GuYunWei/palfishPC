$(function(){
	$("body").on("click", ".user_tab>div", function(){userSwitch(this)})
	.on("click", ".login", userLogin)
	.on("keydown", "#editArea", MessageTextOnKeyEnter)
	.on("click", ".action>a.btn_send", sendMessage)

	.on("click", ".message .picture .msg-img", function(){imgPreview(this)})
	.on("click", "#imgPreview a#prev", imgPrev)
	.on("click", "#imgPreview a#next", imgNext)
	.on("click", "#imgPreview a#download", saveImg)
	.on("click", ".bubble .voice", function(){ playVoice(this);})
	.on("click", ".img_preview_close", function () {
			$("#imgPreview").addClass("hide");
			$("#imgContainer img").remove();
	});
})

function playVoice(that){
	var wave = $(that).find("i");
	$(wave).hasClass("palfish_voice_gray") ? $(wave).addClass("palfish_voice_gray_playing") : $(wave).addClass("palfish_voice_playing");
}

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

function getimg() //另存为存放在服务器上图片到本地的方法
{
    event.returnValue=false;
    show.window.location.href=$("#imgContainer>img").attr("src");
    timer=setInterval(checkload,100)
}

function checkload()
{
    if(show.readyState!="complete")
    {
        //调用document.execCommand方法，'Saveas'表示打开文件另存为对话框命令
        show.document.execCommand('SaveAs');
        clearInterval(timer)
    }
}  

function downLoadImage() {
	var imagePathURL = $("#imgContainer>img").attr("src");
		//如果中间IFRAME不存在，则添加 
		if (!document.getElementById("_SAVEASIMAGE_TEMP_FRAME"))
			$('<iframe style="display:none;" id="_SAVEASIMAGE_TEMP_FRAME" name="_SAVEASIMAGE_TEMP_FRAME" onload="_doSaveAsImage();" width="0"	height="0" src="about:blank" > </iframe>').appendTo("body"); 
				if (document.all._SAVEASIMAGE_TEMP_FRAME.src != imagePathURL) {
					//图片地址发生变化，加载图片 
					document.all._SAVEASIMAGE_TEMP_FRAME.src = imagePathURL;
				} else {
					//图片地址没有变化，直接另存为 
					_doSaveAsImage();
				}
			}

		function _doSaveAsImage() {
			if (document.all._SAVEASIMAGE_TEMP_FRAME.src != "about:blank")
				document.frames("_SAVEASIMAGE_TEMP_FRAME").document.execCommand("SaveAs");
		}

function saveImg() {
	if (document.all.a1 == null) {
		objIframe = document.createElement("IFRAME");
		document.body.insertBefore(objIframe);
		objIframe.outerHTML = "<iframe name=a1 style='width:400px;hieght:300px' src=" + imageName.href + "></iframe>";
		re = setTimeout("savepic()", 1)
	} else {
		clearTimeout(re)
		pic = window.open(imageName.href, "a1")
		pic.document.execCommand("SaveAs")
		document.all.a1.removeNode(true)
	}
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

function MessageTextOnKeyEnter1(e) {
    if (e.keyCode == 13) {
        if (e.ctrlKey) {
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
        return false;
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

