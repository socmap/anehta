// 用于存放临时数据以及交换数据
//var cache = new anehta.core.cache();


//alert("cache: "+anehtaCache.version);
anehtaCache.setItem("domain1", document.domain);
anehtaCache.setItem("domain2", document.domain);
anehtaCache.setItem("domain3", document.domain);
anehtaCache.setItem("domain4", document.domain);
anehtaCache.setItem("domain5", document.domain);
anehtaCache.setItem("domain6", document.domain);
anehtaCache.setItem("domain7", document.domain);
anehtaCache.setItem("domain8", document.domain);
anehtaCache.setItem("domain9", document.domain);
anehtaCache.setItem("domain10", document.domain);
anehtaCache.setItem("domain11", document.domain);

//anehtaCache.overwriteItem("domain3", "ssss");

//var tt = anehtaCache.removeItem("domain8");
var x = anehtaCache.getItem("domain8");
alert(x);

anehtaCache.dropItem("domain8");

var x = anehtaCache.hasItem("domain8");
alert("x: "+x);


//alert("cache1: "+anehtaCache.version);
//var test = anehtaCache.getItem("domain1");
//setTimeout(function(){alert(anehtaCache.hasItem("domain6"));}, 3000);