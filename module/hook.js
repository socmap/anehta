// alert("hook.js");
// hook 表单提交; hook JS函数
// Author: axis
//////////////////////////////////
////  开始执行功能 ///////////////

////////////////////////////////////////////////////////////////
// 第一种hook submit方法
// 使用jquery中的bind方法给表单添加submit事件,从而hook 表单提交
////////////////////////////////////////////////////////////////
/*
$("form").bind("submit", 
               function(){ anehta.logger.logForm($("form")[0]); }
               );
*/


///////////////////////////////////////////////////////////////
// 第二种hook submit方法
// JQuery 直接的hook submit 方法
///////////////////////////////////////////////////////////////
/*
$("form[name='form1']").eq(0).submit(function(){
	                anehta.logger.logForm($("form[name='form1']")[0]);
	                //anehta.logger.logCookie();
	                //return true;
	              }
	              );
*/
////////////////////////////////////////////////////////////////
// 第三种hook submit 方法
// 如果是在javascript函数里调用了表单的比如: form.submit();
// 则需要先hookSubmit
////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//  表单hook后执行的函数,第一个参数是被hook的表单
//  Hook后执行的功能函数,修改以符合自己需要的功能
/*
function injectSubmitFunc(o, param){
	// your code here!
	alert(param);
	anehta.logger.logForm($("form")[0]);
	
	
	// 最后记得恢复表单的正常提交
	if (o._submit != undefined) {
				o._submit(); // 被hook过了
			} else {
				o.submit();
			}
			 
}

anehta.inject.hookSubmit($("form")[0], function (){injectSubmitFunc($("form")[0], "fvck");});
*/

///////////////////////////////////////////////////////////////
// hook 一般函数的方法
// 使用委托; 
// 注意hook函数加载前,如果函数已经调用了,则该函数无法hook 
// var hj = new hookJsFunction();
// hj.hook("被hook的函数名", "保存原函数的变量", "你的函数名");
// hi.unhook("被hook的函数名", "保存原函数的变量");
///////////////////////////////////////////////////////////////

// 自定义函数1
function test(a,b,c,d,e){
	alert("Hooked!");

	var ret = new Array("anehtaTestHook");
	return ret;

}

// 自定义函数2
function test2(x,y){
	alert("test2");
	
	// 新参数
	var ret = new Array("r","t");
	return ret;
}


// 保存原函数
var _function1, _test;
anehtaHook.hook('checktext', '_function1', 'test');
//alert(_function1);
//hj.hook("test","_test", "test2");
//anehtaHook.injectFn('escape', '_function1', 'test');
//hj.injectFn("test","_test", "test2");

//setTimeout(function(){function1(); hj.unhook("test","_test");},6000);



//////////////////////////////////////////////////////////////
/// 直接重载同名函数,晚加载的可以覆盖先加载的
//////////////////////////////////////////////////////////////
//function function1(){
//	alert(3);
//}
