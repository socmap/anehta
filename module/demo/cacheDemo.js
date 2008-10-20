// 用于存放临时数据以及交换数据
//var cache = new anehta.core.cache();


//alert("cache: "+anehtaCache.version);
anehtaCache.addItem("domain1", document.domain);
anehtaCache.addItem("domain2", document.domain);
anehtaCache.addItem("domain3", document.domain);
anehtaCache.addItem("domain4", document.domain);
anehtaCache.addItem("domain5", document.domain);
anehtaCache.addItem("domain6", document.domain);
anehtaCache.addItem("domain7", document.domain);
anehtaCache.addItem("domain8", document.domain);
anehtaCache.addItem("domain9", document.domain);
anehtaCache.addItem("domain10", document.domain);
anehtaCache.addItem("domain11", document.domain);

//anehtaCache.setItem("domain3", "ssss");

//var tt = anehtaCache.removeItem("domain8");
var x = anehtaCache.getItem("domain8");
//alert(x);

anehtaCache.dropItem("domain8");

var x = anehtaCache.hasItem("domain8");
//alert("x: "+x);
setTimeout(function(){anehtaCache.addItem("fvck", "tttttttttttt");}, 20000);


//alert("cache1: "+anehtaCache.version);
//var test = anehtaCache.getItem("domain1");
//setTimeout(function(){alert(anehtaCache.hasItem("domain6"));}, 3000);