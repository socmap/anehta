
// addCookie 也相当于重置了cookie的值
document.cookie = anehta.dom.addCookie("cookie1", "xxxx");
document.cookie = anehta.dom.addCookie("cookie2", "xxxx");
document.cookie = anehta.dom.addCookie("cookie3", "xxxx");
document.cookie = anehta.dom.addCookie("cookie4", "xxxx");
document.cookie = anehta.dom.addCookie("cookie5", "xxxx");
document.cookie = anehta.dom.addCookie("cookie6", "xxxx");

cookievalue = anehta.dom.getCookie("cookie3");
//alert("cookie3: "+cookievalue);

anehta.dom.delCookie("cookie4");

setTimeout(function (){
	var set;
	set = anehta.dom.setCookie("cookie3", "yyyy"); 
	//alert("set: " + set);
	//alert("after setcookie: "+$d.cookie);
	}, 
	3000);