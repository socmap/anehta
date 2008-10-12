//alert("ajax.js");
////////////////////////////////////////////////////////////
/////  Ajax 功能
////////////////////////////////////////////////////////////
/*
* XmlHttp 类
*/
var XmlHttp = function() {
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
var xmlhttp = new XmlHttp();
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
var xmlhttp = new XmlHttp();

///////////////////////////////////////////////
//// 封装POST/GET
///////////////////////////////////////////////
function ajaxpost(url, param){ 
  // 第二个参数是提交的参数,第三个参数是headers
	xmlhttp.post(url, param, null, function(response, responseHeaders) {
		 if (responseHeaders != null) {
			 alert(responseHeaders);
		 }
    
		 if (response != null) {
			 alert(response);
		 }		    
	 });
}
 
function ajaxget(url){
  // 第二个参数是headers
	xmlhttp.get(url, null, function(response, responseHeaders) {
		if (responseHeaders != null) {
			alert(responseHeaders);
		}
    
		if (response != null) {
			alert(response);
		}
	});
} 