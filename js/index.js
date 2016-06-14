$(function(){
	$("body").on("click", ".user_tab>div", function(){userSwitch(this)});
	$("body").on("click", ".login", userLogin);
})

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